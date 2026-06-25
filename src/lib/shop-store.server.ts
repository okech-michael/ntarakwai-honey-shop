import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SHOP_PRODUCTS, type ShopProduct, type ShopReview } from "./products";

export interface ShopReviewInput {
  name: string;
  title: string;
  comment: string;
  rating: number;
}

interface ProductStateEntry {
  stock: number;
  reviews: ShopReview[];
}

interface ShopState {
  products: Record<string, ProductStateEntry>;
  orders: CheckoutOrder[];
}

export interface CheckoutOrder {
  id: string;
  items: Array<{ productId: string; qty: number; unitPrice: number; lineTotal: number }>;
  customer: Record<string, string>;
  paymentMethod: "mpesa" | "bank";
  amount: number;
  paymentStatus: "pending" | "initiated" | "paid" | "failed";
  checkoutRequestID?: string;
  merchantRequestID?: string;
  createdAt: string;
  paidAt?: string;
}

interface CheckoutPayload {
  items: Array<{ productId: string; qty: number }>;
  customer: Record<string, string>;
  paymentMethod: "mpesa" | "bank";
  phone?: string;
  amount: number;
}

interface MpesaCallbackPayload {
  ResultCode?: number;
  ResultDesc?: string;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  Body?: {
    stkCallback?: {
      ResultCode?: number;
      ResultDesc?: string;
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
    };
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.resolve(process.cwd(), "data", "shop-state.json");

function createDefaultState(): ShopState {
  return {
    products: Object.fromEntries(
      SHOP_PRODUCTS.map((product) => [product.id, { stock: product.stock, reviews: [] as ShopReview[] }]),
    ),
    orders: [],
  };
}

async function readState(): Promise<ShopState> {
  try {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    const raw = await fs.readFile(dataFilePath, "utf8");
    const parsed = JSON.parse(raw) as ShopState;
    return {
      products: parsed.products ?? {},
      orders: parsed.orders ?? [],
    };
  } catch {
    const defaultState = createDefaultState();
    await writeState(defaultState);
    return defaultState;
  }
}

async function writeState(state: ShopState): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(state, null, 2), "utf8");
}

function buildProductWithState(product: ShopProduct, entry: ProductStateEntry | undefined): ShopProduct {
  return {
    ...product,
    stock: entry?.stock ?? product.stock,
    reviews: entry?.reviews ?? [],
  };
}

export async function getCatalogProducts(): Promise<ShopProduct[]> {
  const state = await readState();
  return SHOP_PRODUCTS.map((product) => buildProductWithState(product, state.products[product.id]));
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | undefined> {
  const product = SHOP_PRODUCTS.find((entry) => entry.slug === slug);
  if (!product) return undefined;
  const state = await readState();
  return buildProductWithState(product, state.products[product.id]);
}

export async function getOrderStatus(orderNumber: string): Promise<CheckoutOrder | undefined> {
  const state = await readState();
  return state.orders.find((entry) => entry.id === orderNumber);
}

export async function addProductReview(slug: string, input: ShopReviewInput): Promise<ShopProduct | undefined> {
  const product = SHOP_PRODUCTS.find((entry) => entry.slug === slug);
  if (!product) return undefined;

  const state = await readState();
  const entry = state.products[product.id] ?? { stock: product.stock, reviews: [] };
  const review: ShopReview = {
    id: `review-${Date.now()}`,
    name: input.name.trim() || "Guest",
    title: input.title.trim() || "Great value",
    comment: input.comment.trim(),
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    createdAt: new Date().toISOString(),
  };

  entry.reviews = [review, ...entry.reviews].slice(0, 20);
  state.products[product.id] = entry;
  await writeState(state);
  return buildProductWithState(product, entry);
}

export async function processCheckout(payload: CheckoutPayload): Promise<{ ok: boolean; orderNumber: string; paymentStatus: string; paymentMessage: string; checkoutRequestID?: string }> {
  const state = await readState();

  const orderItems = [] as CheckoutOrder["items"];
  for (const item of payload.items) {
    const product = SHOP_PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product ${item.productId}`);
    }

    const entry = state.products[product.id] ?? { stock: product.stock, reviews: [] };
    if (entry.stock < item.qty) {
      throw new Error(`Only ${entry.stock} units left for ${product.name}`);
    }

    entry.stock -= item.qty;
    state.products[product.id] = entry;

    orderItems.push({
      productId: product.id,
      qty: item.qty,
      unitPrice: product.price,
      lineTotal: product.price * item.qty,
    });
  }

  const orderNumber = `HF${Date.now().toString().slice(-8)}`;
  const order: CheckoutOrder = {
    id: orderNumber,
    items: orderItems,
    customer: payload.customer,
    paymentMethod: payload.paymentMethod,
    amount: payload.amount,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  if (payload.paymentMethod === "mpesa") {
    const mpesaResult = await initiateMpesaPayment({
      amount: payload.amount,
      phone: payload.phone ?? payload.customer.phone ?? "",
      orderNumber,
    });
    order.paymentStatus = mpesaResult.ok ? "initiated" : "pending";
    order.checkoutRequestID = mpesaResult.checkoutRequestID;
    order.merchantRequestID = mpesaResult.merchantRequestID;
  }

  state.orders.push(order);
  await writeState(state);

  return {
    ok: true,
    orderNumber,
    paymentStatus: order.paymentStatus,
    paymentMessage: payload.paymentMethod === "mpesa"
      ? "Your M-Pesa STK push request has been sent. Please complete the prompt on your phone."
      : "Your bank transfer request has been received and is awaiting confirmation.",
    checkoutRequestID: order.checkoutRequestID,
  };
}

export async function handleMpesaCallback(payload: MpesaCallbackPayload): Promise<{ ok: boolean; message: string }> {
  const state = await readState();
  const callback = payload.Body?.stkCallback ?? payload;
  const checkoutRequestID = callback.CheckoutRequestID ?? payload.CheckoutRequestID;
  const merchantRequestID = callback.MerchantRequestID ?? payload.MerchantRequestID;
  const order = state.orders.find((entry) => entry.checkoutRequestID === checkoutRequestID || entry.merchantRequestID === merchantRequestID);

  if (!order) {
    return { ok: false, message: "Order not found for callback." };
  }

  if ((callback.ResultCode ?? payload.ResultCode ?? 0) === 0) {
    order.paymentStatus = "paid";
    order.paidAt = new Date().toISOString();
  } else {
    order.paymentStatus = "failed";
    for (const item of order.items) {
      const product = SHOP_PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) continue;
      const stockEntry = state.products[product.id] ?? { stock: product.stock, reviews: [] };
      stockEntry.stock += item.qty;
      state.products[product.id] = stockEntry;
    }
  }

  await writeState(state);
  return { ok: true, message: order.paymentStatus === "paid" ? "Payment confirmed." : "Payment failed; stock restored." };
}

async function initiateMpesaPayment({ amount, phone, orderNumber }: { amount: number; phone: string; orderNumber: string }) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY || "uAW7d6v1dVjpYjcLMyubVmvVBn7LtE6iTcIaJIr1Fg4nwDGl";
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "6GAttjZEPuysj2CZbkc3VAoufQAS44azTDoymOSGhFpgn6FIKmiABmsJwznTQzTo";
  const shortCode = process.env.MPESA_SHORTCODE || "174379";
  const passKey = process.env.MPESA_PASSKEY || "";
  const callbackUrl = process.env.MPESA_CALLBACK_URL || "http://localhost:3000/api/mpesa/callback";

  if (!passKey) {
    return {
      ok: false,
      checkoutRequestID: `local-${Date.now()}`,
      merchantRequestID: `local-${Date.now()}`,
      message: "M-Pesa credentials incomplete; payment queued for manual confirmation.",
    };
  }

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
  const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");
  const authResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`,
    },
  });

  if (!authResponse.ok) {
    const body = await authResponse.text();
    throw new Error(`Daraja auth failed: ${body}`);
  }

  const authData = (await authResponse.json()) as { access_token?: string };
  const accessToken = authData.access_token;
  if (!accessToken) {
    throw new Error("Daraja auth returned no access token.");
  }

  const phoneNumber = normalizePhone(phone);
  const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: orderNumber,
      TransactionDesc: `Ntarakuwai Pure & Natural Honey order ${orderNumber}`,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Daraja STK push failed: ${body}`);
  }

  const data = JSON.parse(body) as { CheckoutRequestID?: string; MerchantRequestID?: string; ResponseDescription?: string };
  return {
    ok: true,
    checkoutRequestID: data.CheckoutRequestID,
    merchantRequestID: data.MerchantRequestID,
    message: data.ResponseDescription ?? "Daraja STK push accepted.",
  };
}

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return `254${digits}`;
}

export async function handleShopApiRequest(pathname: string, request: Request): Promise<Response | null> {
  if (pathname === "/api/products" && request.method === "GET") {
    const products = await getCatalogProducts();
    return Response.json({ products }, { status: 200 });
  }

  if (pathname === "/api/checkout" && request.method === "POST") {
    const payload = (await request.json()) as CheckoutPayload;
    try {
      const result = await processCheckout(payload);
      return Response.json(result, { status: 200 });
    } catch (error) {
      return Response.json({ ok: false, error: error instanceof Error ? error.message : "Checkout failed." }, { status: 400 });
    }
  }

  if (pathname.startsWith("/api/products/") && pathname.endsWith("/reviews") && request.method === "POST") {
    const slug = pathname.split("/api/products/")[1]?.replace(/\/reviews$/, "");
    if (!slug) {
      return Response.json({ ok: false, error: "Product slug is required." }, { status: 400 });
    }

    const payload = (await request.json()) as ShopReviewInput;
    try {
      const updatedProduct = await addProductReview(slug, payload);
      return Response.json({ ok: true, product: updatedProduct }, { status: 200 });
    } catch (error) {
      return Response.json({ ok: false, error: error instanceof Error ? error.message : "Review could not be saved." }, { status: 400 });
    }
  }

  if (pathname.startsWith("/api/products/") && request.method === "GET") {
    const slug = pathname.replace("/api/products/", "").replace(/\/$/, "");
    if (!slug) {
      return Response.json({ ok: false, error: "Product slug is required." }, { status: 400 });
    }

    const product = await getProductBySlug(slug);
    if (!product) {
      return Response.json({ ok: false, error: "Product not found." }, { status: 404 });
    }

    return Response.json({ product }, { status: 200 });
  }

  if (pathname.startsWith("/api/orders/") && request.method === "GET") {
    const orderNumber = pathname.replace("/api/orders/", "").replace(/\/$/, "");
    const order = await getOrderStatus(orderNumber);
    return Response.json({ order }, { status: order ? 200 : 404 });
  }

  if (pathname === "/api/mpesa/callback" && request.method === "POST") {
    const payload = (await request.json()) as MpesaCallbackPayload;
    const result = await handleMpesaCallback(payload);
    return Response.json(result, { status: 200 });
  }

  return null;
}
