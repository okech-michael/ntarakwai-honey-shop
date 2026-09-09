import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Boxes,
  CircleDollarSign,
  LayoutDashboard,
  Loader2,
  LogOut,
  PackageSearch,
  RefreshCw,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { formatKES } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard: Ntarakwai Beekeeping" },
      { name: "description", content: "Business intelligence and store management for Ntarakwai Beekeeping Limited." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard: Ntarakwai Beekeeping" },
      { property: "og:description", content: "Revenue, orders, customers and inventory in one place." },
    ],
  }),
  component: AdminPage,
});

/* ------------------------------------------------------------------ */
/* Types (loose mirrors of the server payload)                         */
/* ------------------------------------------------------------------ */

type Grouping = "day" | "week" | "month" | "year";

interface Analytics {
  generatedAt: string;
  assumptions: { cogsRate: number; gatewayRate: number; fulfilmentPerOrder: number; lowStockThreshold: number };
  kpis: Record<string, number>;
  finance: { revenue: number; cogs: number; gatewayFees: number; fulfilment: number; expenses: number; profit: number; margin: number };
  statusCounts: { paid: number; pending: number; initiated: number; failed: number };
  series: Array<{ key: string; revenue: number; orders: number; units: number }>;
  topProducts: Array<{ id: string; name: string; category: string; units: number; revenue: number; orders: number }>;
  categories: Array<{ category: string; revenue: number; units: number }>;
  payments: Array<{ method: string; count: number; volume: number; paid: number; failed: number }>;
  inventory: Array<{ id: string; name: string; category: string; price: number; stock: number; sold: number; stockValue: number; status: string }>;
  customerGrowth: Array<{ key: string; newCustomers: number; activeCustomers: number }>;
  topCustomers: Array<{ key: string; name: string; email: string; phone: string; county: string; orders: number; spend: number; lastOrder: string }>;
  recentOrders: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    customer: Record<string, string>;
    items: Array<{ productId: string; name: string; qty: number; lineTotal: number }>;
  }>;
  reviews: Array<{ productName: string; name: string; title: string; comment: string; rating: number; createdAt: string }>;
  engagement: { reviewCount: number; averageRating: number; countiesServed: number; lastOrderAt: string | null };
  alerts: Array<{ id: string; level: "critical" | "warning" | "info"; title: string; detail: string }>;
}

const TOKEN_KEY = "ntarakwai-admin-token";
const CHART_COLORS = ["#E9A40C", "#D17A00", "#8A4E0F", "#F5C542", "#B4761C", "#6B4A16"];

const RANGES: Array<{ label: string; days: number; grouping: Grouping }> = [
  { label: "7 days", days: 7, grouping: "day" },
  { label: "30 days", days: 30, grouping: "day" },
  { label: "90 days", days: 90, grouping: "week" },
  { label: "12 months", days: 365, grouping: "month" },
  { label: "All time", days: 1095, grouping: "month" },
];

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "revenue", label: "Revenue & Sales", icon: CircleDollarSign },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: PackageSearch },
  { id: "customers", label: "Customers", icon: Users },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "payments", label: "Payments & Finance", icon: Wallet },
  { id: "engagement", label: "Reviews", icon: Star },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return (
      <AdminLogin
        onSuccess={(value) => {
          localStorage.setItem(TOKEN_KEY, value);
          setToken(value);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      token={token}
      onSignOut={() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; token?: string; error?: string };
      if (!res.ok || !data.ok || !data.token) {
        setError(data.error ?? "Incorrect password.");
        return;
      }
      onSuccess(data.token);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-secondary/40 to-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Admin dashboard</h1>
            <p className="text-xs text-muted-foreground">Ntarakwai Beekeeping Limited</p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Enter admin password"
        />
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function AdminDashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [rangeIndex, setRangeIndex] = useState(1);
  const [grouping, setGrouping] = useState<Grouping>("day");
  const [section, setSection] = useState<SectionId>("overview");
  const queryClient = useQueryClient();
  const range = RANGES[rangeIndex]!;

  useEffect(() => {
    setGrouping(range.grouping);
  }, [range.grouping]);

  const query = useQuery({
    queryKey: ["admin-analytics", range.days, grouping],
    queryFn: async (): Promise<Analytics> => {
      const res = await fetch(`/api/admin/analytics?days=${range.days}&grouping=${grouping}`, {
        headers: { "x-admin-token": token },
      });
      if (res.status === 401) {
        onSignOut();
        throw new Error("Session expired.");
      }
      const json = (await res.json()) as { ok: boolean; data: Analytics };
      return json.data;
    },
    refetchInterval: 60_000,
  });

  const data = query.data;

  async function mutate(path: string, body: unknown) {
    await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify(body),
    });
    await queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">Business dashboard</p>
              <p className="text-[11px] text-muted-foreground">Ntarakwai Beekeeping Limited</p>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-border bg-background p-0.5">
              {RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setRangeIndex(i)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                    i === rangeIndex ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value as Grouping)}
              className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground"
            >
              <option value="day">By day</option>
              <option value="week">By week</option>
              <option value="month">By month</option>
              <option value="year">By year</option>
            </select>

            <button
              onClick={() => query.refetch()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", query.isFetching && "animate-spin")} />
              Refresh
            </button>

            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6">
        <nav className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24 space-y-1">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  section === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
                  section === item.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {query.isLoading && (
            <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {query.isError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
              Could not load the dashboard data. Try refreshing.
            </div>
          )}

          {data && (
            <div className="space-y-6">
              {section === "overview" && <Overview data={data} />}
              {section === "revenue" && <RevenueSection data={data} />}
              {section === "orders" && (
                <OrdersSection data={data} onStatus={(orderId, status) => mutate("/api/admin/order-status", { orderId, status })} />
              )}
              {section === "products" && <ProductsSection data={data} />}
              {section === "customers" && <CustomersSection data={data} />}
              {section === "inventory" && (
                <InventorySection data={data} onStock={(productId, stock) => mutate("/api/admin/stock", { productId, stock })} />
              )}
              {section === "payments" && <PaymentsSection data={data} />}
              {section === "engagement" && <ReviewsSection data={data} />}

              <p className="pt-2 text-center text-[11px] text-muted-foreground">
                Updated {new Date(data.generatedAt).toLocaleString()} · costs estimated at{" "}
                {Math.round(data.assumptions.cogsRate * 100)}% production, {formatKES(data.assumptions.fulfilmentPerOrder)} fulfilment per
                order
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

function Panel({ title, subtitle, children, className }: { title?: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      {title && (
        <header className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

function Kpi({
  label,
  value,
  change,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">{value}</p>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        {typeof change === "number" && (
          <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-emerald-600" : "text-destructive")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-700"
      : status === "failed"
        ? "bg-destructive/10 text-destructive"
        : "bg-amber-500/10 text-amber-700";
  return <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", tone)}>{status}</span>;
}

const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12 },
};

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-8 text-center text-xs text-muted-foreground">
        {message}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Overview({ data }: { data: Analytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Revenue" value={formatKES(data.kpis.revenue ?? 0)} change={data.kpis.revenueChange} icon={CircleDollarSign} hint="vs previous period" />
        <Kpi label="Orders" value={String(data.kpis.orders ?? 0)} change={data.kpis.ordersChange} icon={ShoppingCart} hint="vs previous period" />
        <Kpi label="Completed" value={String(data.kpis.completedOrders ?? 0)} change={data.kpis.completedChange} icon={BadgeCheck} />
        <Kpi label="Pending" value={String(data.kpis.pendingOrders ?? 0)} icon={Loader2} hint="awaiting payment" />
        <Kpi label="Cancelled / failed" value={String(data.kpis.cancelledOrders ?? 0)} icon={AlertTriangle} />
        <Kpi label="Customers" value={String(data.kpis.customers ?? 0)} icon={Users} hint={`${data.kpis.newCustomers ?? 0} new`} />
        <Kpi label="Products" value={String(data.kpis.products ?? 0)} icon={PackageSearch} hint={`${formatKES(data.kpis.stockValue ?? 0)} stock value`} />
        <Kpi label="Average order" value={formatKES(data.kpis.averageOrderValue ?? 0)} icon={Wallet} hint={`${(data.kpis.conversion ?? 0).toFixed(0)}% paid`} />
      </div>

      <Panel title="Business alerts" subtitle="Things worth your attention right now">
        <ul className="space-y-2">
          {data.alerts.map((alert) => (
            <li
              key={alert.id}
              className={cn(
                "rounded-lg border p-3",
                alert.level === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : alert.level === "warning"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-emerald-500/30 bg-emerald-500/5",
              )}
            >
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.detail}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Revenue trend" className="xl:col-span-2">
          <RevenueChart data={data} />
        </Panel>
        <Panel title="Order status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Paid", value: data.statusCounts.paid },
                    { name: "Pending", value: data.statusCounts.pending },
                    { name: "Initiated", value: data.statusCounts.initiated },
                    { name: "Failed", value: data.statusCounts.failed },
                  ].filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {CHART_COLORS.map((color) => (
                    <Cell key={color} fill={color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Top products by revenue">
          <ProductTable rows={data.topProducts.slice(0, 6)} />
        </Panel>
        <Panel title="Latest orders">
          <OrdersTable rows={data.recentOrders.slice(0, 6)} />
        </Panel>
      </div>
    </>
  );
}

function RevenueChart({ data }: { data: Analytics }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.series}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E9A40C" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#E9A40C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="key" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
          <Tooltip formatter={(v: number) => formatKES(Number(v))} {...tooltipStyle} />
          <Area type="monotone" dataKey="revenue" stroke="#E9A40C" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueSection({ data }: { data: Analytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Revenue" value={formatKES(data.kpis.revenue ?? 0)} change={data.kpis.revenueChange} icon={CircleDollarSign} />
        <Kpi label="Lifetime revenue" value={formatKES(data.kpis.lifetimeRevenue ?? 0)} icon={Wallet} />
        <Kpi label="Units sold" value={String(data.kpis.unitsSold ?? 0)} icon={Boxes} />
        <Kpi label="Gross margin" value={`${data.finance.margin.toFixed(1)}%`} icon={TrendingUp} hint={formatKES(data.finance.profit)} />
      </div>

      <Panel title="Revenue over time">
        <RevenueChart data={data} />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Orders and units">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="key" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke="#8A4E0F" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="units" stroke="#F5C542" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Revenue by category">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categories}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                <Tooltip formatter={(v: number) => formatKES(Number(v))} {...tooltipStyle} />
                <Bar dataKey="revenue" fill="#E9A40C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}

function OrdersTable({
  rows,
  onStatus,
}: {
  rows: Analytics["recentOrders"];
  onStatus?: (orderId: string, status: string) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium">Order</th>
            <th className="px-3 py-2 font-medium">Customer</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Method</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Amount</th>
            {onStatus && <th className="px-3 py-2 font-medium">Update</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow colSpan={onStatus ? 7 : 6} message="No orders yet." />}
          {rows.map((order) => (
            <>
              <tr
                key={order.id}
                onClick={() => setOpen(open === order.id ? null : order.id)}
                className="cursor-pointer border-b border-border/60 hover:bg-accent/40"
              >
                <td className="px-3 py-2 font-medium text-foreground">{order.id}</td>
                <td className="px-3 py-2">{order.customer.fullName ?? "Guest"}</td>
                <td className="px-3 py-2 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 uppercase">{order.paymentMethod}</td>
                <td className="px-3 py-2">
                  <StatusPill status={order.paymentStatus} />
                </td>
                <td className="px-3 py-2 text-right font-medium text-foreground">{formatKES(order.amount)}</td>
                {onStatus && (
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => onStatus(order.id, e.target.value)}
                      className="rounded-md border border-border bg-background px-1.5 py-1 text-[11px]"
                    >
                      <option value="pending">pending</option>
                      <option value="initiated">initiated</option>
                      <option value="paid">paid</option>
                      <option value="failed">failed</option>
                    </select>
                  </td>
                )}
              </tr>
              {open === order.id && (
                <tr key={`${order.id}-detail`} className="border-b border-border/60 bg-muted/40">
                  <td colSpan={onStatus ? 7 : 6} className="px-3 py-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium text-foreground">Items</p>
                        <ul className="space-y-0.5 text-muted-foreground">
                          {order.items.map((item) => (
                            <li key={item.productId}>
                              {item.qty} × {item.name} — {formatKES(item.lineTotal)}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 font-medium text-foreground">Delivery</p>
                        <ul className="space-y-0.5 text-muted-foreground">
                          {Object.entries(order.customer).map(([key, value]) => (
                            <li key={key}>
                              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>: {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersSection({ data, onStatus }: { data: Analytics; onStatus: (orderId: string, status: string) => void }) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      data.recentOrders.filter((o) => {
        if (status !== "all" && o.paymentStatus !== status) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          Object.values(o.customer).some((v) => String(v).toLowerCase().includes(q))
        );
      }),
    [data.recentOrders, status, search],
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Total orders" value={String(data.kpis.orders ?? 0)} change={data.kpis.ordersChange} icon={ShoppingCart} />
        <Kpi label="Completed" value={String(data.statusCounts.paid)} icon={BadgeCheck} />
        <Kpi label="Pending" value={String(data.statusCounts.pending + data.statusCounts.initiated)} icon={Loader2} />
        <Kpi label="Failed" value={String(data.statusCounts.failed)} icon={AlertTriangle} />
      </div>

      <Panel title="All orders" subtitle="Click any row to see items and delivery details">
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number, name, phone…"
            className="min-w-[200px] flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs"
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="initiated">Initiated</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <OrdersTable rows={rows} onStatus={onStatus} />
      </Panel>
    </>
  );
}

function ProductTable({ rows }: { rows: Analytics["topProducts"] }) {
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium">Product</th>
            <th className="px-3 py-2 font-medium">Category</th>
            <th className="px-3 py-2 text-right font-medium">Units</th>
            <th className="px-3 py-2 text-right font-medium">Revenue</th>
            <th className="w-32 px-3 py-2 font-medium">Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyRow colSpan={5} message="No sales in this period." />}
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60">
              <td className="px-3 py-2 font-medium text-foreground">{row.name}</td>
              <td className="px-3 py-2 text-muted-foreground">{row.category}</td>
              <td className="px-3 py-2 text-right">{row.units}</td>
              <td className="px-3 py-2 text-right font-medium text-foreground">{formatKES(row.revenue)}</td>
              <td className="px-3 py-2">
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(row.revenue / max) * 100}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsSection({ data }: { data: Analytics }) {
  return (
    <>
      <Panel title="Product performance" subtitle="Paid orders only">
        <ProductTable rows={data.topProducts} />
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Units sold by product">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts.slice(0, 8)} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="units" fill="#D17A00" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Category mix">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categories} dataKey="revenue" nameKey="category" outerRadius={95}>
                  {data.categories.map((c, i) => (
                    <Cell key={c.category} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatKES(Number(v))} {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}

function CustomersSection({ data }: { data: Analytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Customers" value={String(data.kpis.customers ?? 0)} icon={Users} />
        <Kpi label="New customers" value={String(data.kpis.newCustomers ?? 0)} icon={TrendingUp} />
        <Kpi label="Repeat rate" value={`${(data.kpis.repeatRate ?? 0).toFixed(1)}%`} icon={BadgeCheck} />
        <Kpi label="Counties served" value={String(data.engagement.countiesServed)} icon={PackageSearch} />
      </div>

      <Panel title="Customer growth">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="key" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="newCustomers" name="New" fill="#E9A40C" radius={[6, 6, 0, 0]} />
              <Bar dataKey="activeCustomers" name="Orders placed" fill="#8A4E0F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Top customers by spend">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Contact</th>
                <th className="px-3 py-2 font-medium">County</th>
                <th className="px-3 py-2 text-right font-medium">Orders</th>
                <th className="px-3 py-2 text-right font-medium">Spend</th>
                <th className="px-3 py-2 font-medium">Last order</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.length === 0 && <EmptyRow colSpan={6} message="No customers yet." />}
              {data.topCustomers.map((c) => (
                <tr key={c.key} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium text-foreground">{c.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.phone || c.email || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.county || "—"}</td>
                  <td className="px-3 py-2 text-right">{c.orders}</td>
                  <td className="px-3 py-2 text-right font-medium text-foreground">{formatKES(c.spend)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{new Date(c.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function InventorySection({ data, onStock }: { data: Analytics; onStock: (productId: string, stock: number) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Stock value" value={formatKES(data.kpis.stockValue ?? 0)} icon={Wallet} />
        <Kpi label="Out of stock" value={String(data.inventory.filter((p) => p.status === "out").length)} icon={AlertTriangle} />
        <Kpi label="Running low" value={String(data.inventory.filter((p) => p.status === "low").length)} icon={Boxes} />
        <Kpi label="Products" value={String(data.inventory.length)} icon={PackageSearch} />
      </div>

      <Panel title="Inventory" subtitle="Edit a stock number and press Enter to save">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Sold</th>
                <th className="px-3 py-2 text-right font-medium">Stock value</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">In stock</th>
              </tr>
            </thead>
            <tbody>
              {data.inventory.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium text-foreground">{p.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{p.category}</td>
                  <td className="px-3 py-2 text-right">{formatKES(p.price)}</td>
                  <td className="px-3 py-2 text-right">{p.sold}</td>
                  <td className="px-3 py-2 text-right">{formatKES(p.stockValue)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        p.status === "out"
                          ? "bg-destructive/10 text-destructive"
                          : p.status === "low"
                            ? "bg-amber-500/10 text-amber-700"
                            : "bg-emerald-500/10 text-emerald-700",
                      )}
                    >
                      {p.status === "out" ? "Out of stock" : p.status === "low" ? "Low" : "Healthy"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <StockInput value={p.stock} onSave={(v) => onStock(p.id, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function StockInput({ value, onSave }: { value: number; onSave: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <input
      type="number"
      min={0}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => Number(draft) !== value && onSave(Math.max(0, Number(draft) || 0))}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      className="w-20 rounded-md border border-border bg-background px-2 py-1 text-[11px]"
    />
  );
}

function PaymentsSection({ data }: { data: Analytics }) {
  const finance = [
    { name: "Revenue", value: data.finance.revenue },
    { name: "Production", value: data.finance.cogs },
    { name: "Fulfilment", value: data.finance.fulfilment },
    { name: "Fees", value: data.finance.gatewayFees },
    { name: "Profit", value: data.finance.profit },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Revenue" value={formatKES(data.finance.revenue)} icon={CircleDollarSign} />
        <Kpi label="Estimated costs" value={formatKES(data.finance.expenses)} icon={Wallet} />
        <Kpi label="Estimated profit" value={formatKES(data.finance.profit)} icon={TrendingUp} />
        <Kpi label="Margin" value={`${data.finance.margin.toFixed(1)}%`} icon={BarChart3} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Money in and out" subtitle="Costs are estimates you can tune later">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v: number) => formatKES(Number(v))} {...tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {finance.map((f, i) => (
                    <Cell key={f.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Payment methods">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 font-medium">Method</th>
                  <th className="px-3 py-2 text-right font-medium">Attempts</th>
                  <th className="px-3 py-2 text-right font-medium">Paid</th>
                  <th className="px-3 py-2 text-right font-medium">Failed</th>
                  <th className="px-3 py-2 text-right font-medium">Volume</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.length === 0 && <EmptyRow colSpan={5} message="No payments in this period." />}
                {data.payments.map((p) => (
                  <tr key={p.method} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium uppercase text-foreground">{p.method}</td>
                    <td className="px-3 py-2 text-right">{p.count}</td>
                    <td className="px-3 py-2 text-right">{p.paid}</td>
                    <td className="px-3 py-2 text-right">{p.failed}</td>
                    <td className="px-3 py-2 text-right font-medium text-foreground">{formatKES(p.volume)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}

function ReviewsSection({ data }: { data: Analytics }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Reviews" value={String(data.engagement.reviewCount)} icon={Star} />
        <Kpi label="Average rating" value={data.engagement.averageRating.toFixed(1)} icon={BadgeCheck} />
        <Kpi label="Counties served" value={String(data.engagement.countiesServed)} icon={Users} />
        <Kpi
          label="Last order"
          value={data.engagement.lastOrderAt ? new Date(data.engagement.lastOrderAt).toLocaleDateString() : "—"}
          icon={ShoppingCart}
        />
      </div>

      <Panel title="Latest reviews">
        {data.reviews.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {data.reviews.map((r, i) => (
              <li key={`${r.productName}-${i}`} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{r.title}</span>
                  <span className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{r.productName}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.comment}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {r.name} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
