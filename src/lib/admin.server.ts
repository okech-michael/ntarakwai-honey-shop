import { SHOP_PRODUCTS } from "./products";
import {
  getAdminStoreData,
  adminUpdateOrderStatus,
  adminUpdateStock,
  type CheckoutOrder,
} from "./shop-store.server";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ntarakwai2026";
}

function tokenFor(password: string): string {
  // Lightweight deterministic token; rotates whenever the password changes.
  let hash = 5381;
  const salt = `ntarakwai-admin::${password}`;
  for (let i = 0; i < salt.length; i += 1) {
    hash = ((hash << 5) + hash + salt.charCodeAt(i)) >>> 0;
  }
  return `adm_${hash.toString(36)}${salt.length.toString(36)}`;
}

function isAuthorised(request: Request): boolean {
  const header = request.headers.get("x-admin-token") ?? "";
  return Boolean(header) && header === tokenFor(adminPassword());
}

/* ------------------------------------------------------------------ */
/* Business assumptions (editable estimates, clearly surfaced in UI)   */
/* ------------------------------------------------------------------ */

const COGS_RATE = 0.52; // production, jars, labels, gatherer payments
const GATEWAY_RATE = 0.015; // M-PESA / card processing
const FULFILMENT_PER_ORDER = 250; // courier + packaging, KES
const LOW_STOCK_THRESHOLD = 12;

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

const PAID: CheckoutOrder["paymentStatus"][] = ["paid"];

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function customerKey(order: CheckoutOrder) {
  return (order.customer.email || order.customer.phone || order.customer.fullName || "guest").toLowerCase();
}

function bucketKey(iso: string, grouping: "day" | "week" | "month" | "year") {
  const d = new Date(iso);
  if (grouping === "year") return `${d.getUTCFullYear()}`;
  if (grouping === "month") return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  if (grouping === "week") {
    const start = new Date(d);
    start.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    return start.toISOString().slice(0, 10);
  }
  return dayKey(iso);
}

export async function buildAdminAnalytics(options: { days: number; grouping: "day" | "week" | "month" | "year" }) {
  const { orders, stock, reviews } = await getAdminStoreData();
  const productById = new Map(SHOP_PRODUCTS.map((p) => [p.id, p]));

  const now = Date.now();
  const rangeMs = options.days * 24 * 60 * 60 * 1000;
  const from = now - rangeMs;
  const prevFrom = from - rangeMs;

  const inRange = orders.filter((o) => new Date(o.createdAt).getTime() >= from);
  const prevRange = orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= prevFrom && t < from;
  });

  const revenueOf = (list: CheckoutOrder[]) =>
    list.filter((o) => PAID.includes(o.paymentStatus)).reduce((sum, o) => sum + o.amount, 0);

  const revenue = revenueOf(inRange);
  const prevRevenue = revenueOf(prevRange);
  const paidOrders = inRange.filter((o) => PAID.includes(o.paymentStatus));

  const statusCounts = {
    paid: inRange.filter((o) => o.paymentStatus === "paid").length,
    pending: inRange.filter((o) => o.paymentStatus === "pending").length,
    initiated: inRange.filter((o) => o.paymentStatus === "initiated").length,
    failed: inRange.filter((o) => o.paymentStatus === "failed").length,
  };

  // Time series
  const seriesMap = new Map<string, { key: string; revenue: number; orders: number; units: number }>();
  for (const order of inRange) {
    const key = bucketKey(order.createdAt, options.grouping);
    const row = seriesMap.get(key) ?? { key, revenue: 0, orders: 0, units: 0 };
    row.orders += 1;
    if (PAID.includes(order.paymentStatus)) {
      row.revenue += order.amount;
      row.units += order.items.reduce((s, i) => s + i.qty, 0);
    }
    seriesMap.set(key, row);
  }
  const series = [...seriesMap.values()].sort((a, b) => a.key.localeCompare(b.key));

  // Product performance (paid orders)
  const perProduct = new Map<string, { id: string; name: string; category: string; units: number; revenue: number; orders: number }>();
  for (const order of paidOrders) {
    for (const item of order.items) {
      const product = productById.get(item.productId);
      const row = perProduct.get(item.productId) ?? {
        id: item.productId,
        name: product?.name ?? item.productId,
        category: product?.category ?? "Other",
        units: 0,
        revenue: 0,
        orders: 0,
      };
      row.units += item.qty;
      row.revenue += item.lineTotal;
      row.orders += 1;
      perProduct.set(item.productId, row);
    }
  }
  const topProducts = [...perProduct.values()].sort((a, b) => b.revenue - a.revenue);

  const categoryMap = new Map<string, { category: string; revenue: number; units: number }>();
  for (const row of topProducts) {
    const entry = categoryMap.get(row.category) ?? { category: row.category, revenue: 0, units: 0 };
    entry.revenue += row.revenue;
    entry.units += row.units;
    categoryMap.set(row.category, entry);
  }
  const categories = [...categoryMap.values()].sort((a, b) => b.revenue - a.revenue);

  // Customers
  const customerMap = new Map<
    string,
    { key: string; name: string; email: string; phone: string; county: string; orders: number; spend: number; firstOrder: string; lastOrder: string }
  >();
  for (const order of orders) {
    const key = customerKey(order);
    const row = customerMap.get(key) ?? {
      key,
      name: order.customer.fullName ?? "Guest",
      email: order.customer.email ?? "",
      phone: order.customer.phone ?? "",
      county: order.customer.county ?? "",
      orders: 0,
      spend: 0,
      firstOrder: order.createdAt,
      lastOrder: order.createdAt,
    };
    row.orders += 1;
    if (PAID.includes(order.paymentStatus)) row.spend += order.amount;
    if (order.createdAt < row.firstOrder) row.firstOrder = order.createdAt;
    if (order.createdAt > row.lastOrder) row.lastOrder = order.createdAt;
    customerMap.set(key, row);
  }
  const allCustomers = [...customerMap.values()];
  const newCustomersInRange = allCustomers.filter((c) => new Date(c.firstOrder).getTime() >= from);
  const repeatCustomers = allCustomers.filter((c) => c.orders > 1);

  const growthMap = new Map<string, { key: string; newCustomers: number; activeCustomers: number }>();
  for (const c of allCustomers) {
    const key = bucketKey(c.firstOrder, options.grouping);
    const row = growthMap.get(key) ?? { key, newCustomers: 0, activeCustomers: 0 };
    row.newCustomers += 1;
    growthMap.set(key, row);
  }
  for (const order of orders) {
    const key = bucketKey(order.createdAt, options.grouping);
    const row = growthMap.get(key) ?? { key, newCustomers: 0, activeCustomers: 0 };
    row.activeCustomers += 1;
    growthMap.set(key, row);
  }
  const customerGrowth = [...growthMap.values()].sort((a, b) => a.key.localeCompare(b.key)).slice(-24);

  // Payments
  const paymentMap = new Map<string, { method: string; count: number; volume: number; paid: number; failed: number }>();
  for (const order of inRange) {
    const row = paymentMap.get(order.paymentMethod) ?? {
      method: order.paymentMethod,
      count: 0,
      volume: 0,
      paid: 0,
      failed: 0,
    };
    row.count += 1;
    if (PAID.includes(order.paymentStatus)) {
      row.volume += order.amount;
      row.paid += 1;
    }
    if (order.paymentStatus === "failed") row.failed += 1;
    paymentMap.set(order.paymentMethod, row);
  }
  const payments = [...paymentMap.values()].sort((a, b) => b.volume - a.volume);

  // Inventory
  const inventory = SHOP_PRODUCTS.map((product) => {
    const units = stock[product.id] ?? product.stock;
    const sold = perProduct.get(product.id)?.units ?? 0;
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      stock: units,
      sold,
      stockValue: units * product.price,
      status: units === 0 ? "out" : units <= LOW_STOCK_THRESHOLD ? "low" : "ok",
    };
  }).sort((a, b) => a.stock - b.stock);

  const stockValue = inventory.reduce((s, p) => s + p.stockValue, 0);

  // Finance
  const cogs = Math.round(revenue * COGS_RATE);
  const gatewayFees = Math.round(revenue * GATEWAY_RATE);
  const fulfilment = paidOrders.length * FULFILMENT_PER_ORDER;
  const expenses = cogs + gatewayFees + fulfilment;
  const profit = revenue - expenses;

  // Activity + alerts
  const outOfStock = inventory.filter((p) => p.status === "out");
  const lowStock = inventory.filter((p) => p.status === "low");
  const awaitingPayment = orders.filter((o) => o.paymentStatus === "pending" || o.paymentStatus === "initiated");

  const alerts: Array<{ id: string; level: "critical" | "warning" | "info"; title: string; detail: string }> = [];
  if (outOfStock.length) {
    alerts.push({
      id: "out-of-stock",
      level: "critical",
      title: `${outOfStock.length} product${outOfStock.length > 1 ? "s" : ""} out of stock`,
      detail: outOfStock.map((p) => p.name).join(", "),
    });
  }
  if (lowStock.length) {
    alerts.push({
      id: "low-stock",
      level: "warning",
      title: `${lowStock.length} product${lowStock.length > 1 ? "s" : ""} running low`,
      detail: lowStock.map((p) => `${p.name} (${p.stock} left)`).join(", "),
    });
  }
  if (awaitingPayment.length) {
    alerts.push({
      id: "awaiting-payment",
      level: "warning",
      title: `${awaitingPayment.length} order${awaitingPayment.length > 1 ? "s" : ""} awaiting payment confirmation`,
      detail: awaitingPayment.slice(0, 6).map((o) => o.id).join(", "),
    });
  }
  if (statusCounts.failed) {
    alerts.push({
      id: "failed",
      level: "critical",
      title: `${statusCounts.failed} failed payment${statusCounts.failed > 1 ? "s" : ""} in this period`,
      detail: "Stock has been returned automatically. Follow up with these customers.",
    });
  }
  if (!alerts.length) {
    alerts.push({ id: "ok", level: "info", title: "Everything looks healthy", detail: "No stock or payment issues detected." });
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const conversion = inRange.length ? (statusCounts.paid / inRange.length) * 100 : 0;
  const prevPaidCount = prevRange.filter((o) => o.paymentStatus === "paid").length;

  const pct = (current: number, previous: number) =>
    previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;

  return {
    generatedAt: new Date().toISOString(),
    range: { days: options.days, grouping: options.grouping },
    assumptions: { cogsRate: COGS_RATE, gatewayRate: GATEWAY_RATE, fulfilmentPerOrder: FULFILMENT_PER_ORDER, lowStockThreshold: LOW_STOCK_THRESHOLD },
    kpis: {
      revenue,
      revenueChange: pct(revenue, prevRevenue),
      orders: inRange.length,
      ordersChange: pct(inRange.length, prevRange.length),
      completedOrders: statusCounts.paid,
      completedChange: pct(statusCounts.paid, prevPaidCount),
      pendingOrders: statusCounts.pending + statusCounts.initiated,
      cancelledOrders: statusCounts.failed,
      unitsSold: paidOrders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0),
      averageOrderValue: statusCounts.paid ? Math.round(revenue / statusCounts.paid) : 0,
      customers: allCustomers.length,
      newCustomers: newCustomersInRange.length,
      repeatRate: allCustomers.length ? (repeatCustomers.length / allCustomers.length) * 100 : 0,
      products: SHOP_PRODUCTS.length,
      lifetimeRevenue: revenueOf(orders),
      lifetimeOrders: orders.length,
      conversion,
      stockValue,
    },
    finance: { revenue, cogs, gatewayFees, fulfilment, expenses, profit, margin: revenue ? (profit / revenue) * 100 : 0 },
    statusCounts,
    series,
    topProducts,
    categories,
    payments,
    inventory,
    customerGrowth,
    topCustomers: [...allCustomers].sort((a, b) => b.spend - a.spend).slice(0, 10),
    recentOrders: [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 40)
      .map((o) => ({
        ...o,
        items: o.items.map((i) => ({ ...i, name: productById.get(i.productId)?.name ?? i.productId })),
      })),
    reviews: [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12).map((r) => ({
      ...r,
      productName: productById.get(r.productId)?.name ?? r.productId,
    })),
    engagement: {
      reviewCount: reviews.length,
      averageRating: avgRating,
      countiesServed: new Set(orders.map((o) => (o.customer.county ?? "").trim()).filter(Boolean)).size,
      lastOrderAt: orders.length ? [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]!.createdAt : null,
    },
    alerts,
  };
}

export type AdminAnalytics = Awaited<ReturnType<typeof buildAdminAnalytics>>;

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

export async function handleAdminApiRequest(pathname: string, request: Request): Promise<Response | null> {
  if (!pathname.startsWith("/api/admin/")) return null;

  if (pathname === "/api/admin/login" && request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { password?: string };
    if ((body.password ?? "") !== adminPassword()) {
      return Response.json({ ok: false, error: "Incorrect password." }, { status: 401 });
    }
    return Response.json({ ok: true, token: tokenFor(adminPassword()) }, { status: 200 });
  }

  if (!isAuthorised(request)) {
    return Response.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }

  if (pathname === "/api/admin/analytics" && request.method === "GET") {
    const url = new URL(request.url);
    const days = Math.min(1095, Math.max(1, Number(url.searchParams.get("days")) || 30));
    const groupingParam = url.searchParams.get("grouping");
    const grouping = (["day", "week", "month", "year"].includes(groupingParam ?? "") ? groupingParam : "day") as
      | "day"
      | "week"
      | "month"
      | "year";
    const data = await buildAdminAnalytics({ days, grouping });
    return Response.json({ ok: true, data }, { status: 200 });
  }

  if (pathname === "/api/admin/order-status" && request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { orderId?: string; status?: CheckoutOrder["paymentStatus"] };
    if (!body.orderId || !body.status) {
      return Response.json({ ok: false, error: "orderId and status are required." }, { status: 400 });
    }
    const order = await adminUpdateOrderStatus(body.orderId, body.status);
    return Response.json({ ok: Boolean(order), order }, { status: order ? 200 : 404 });
  }

  if (pathname === "/api/admin/stock" && request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { productId?: string; stock?: number };
    if (!body.productId || typeof body.stock !== "number") {
      return Response.json({ ok: false, error: "productId and stock are required." }, { status: 400 });
    }
    const ok = await adminUpdateStock(body.productId, body.stock);
    return Response.json({ ok }, { status: ok ? 200 : 404 });
  }

  return Response.json({ ok: false, error: "Unknown admin endpoint." }, { status: 404 });
}
