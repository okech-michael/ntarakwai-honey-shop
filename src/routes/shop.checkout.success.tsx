import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Check, ShoppingBag, Phone, Truck, Mail } from "lucide-react";

const search = z.object({
  order: z.string().optional(),
  method: z.enum(["mpesa", "bank"]).optional(),
});

export const Route = createFileRoute("/shop/checkout/success")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Order Confirmed — Honeyfield Shop" },
      { name: "description", content: "Your honey order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { order, method } = Route.useSearch();
  const isMpesa = method === "mpesa";

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] border border-border bg-card p-10 text-center shadow-[var(--shadow-card)] md:p-14">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-honey to-honey-deep text-charcoal shadow-lg">
              <Check className="h-9 w-9" strokeWidth={3} />
            </div>
            <h1 className="font-display mt-7 text-4xl text-charcoal md:text-5xl">
              {isMpesa ? "Payment received!" : "Order received!"}
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              {isMpesa
                ? "Your M-Pesa payment has been confirmed. We're preparing your order for dispatch."
                : "Your bank payment is now pending verification. We'll confirm within 24 hours."}
            </p>

            {order && (
              <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-secondary/60 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order #</span>
                <span className="font-display text-lg text-honey-deep">{order}</span>
              </div>
            )}

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
              <Card icon={<Mail className="h-5 w-5" />} t="Confirmation sent" s="Check your inbox for the order receipt." />
              <Card icon={<Truck className="h-5 w-5" />} t="Wells Fargo Courier" s="Tracking number will follow shortly." />
              <Card icon={<Phone className="h-5 w-5" />} t="Need help?" s="Call +254 711 856 795" />
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/shop/products" className="btn-honey"><ShoppingBag className="h-4 w-4" /> Continue shopping</Link>
              <Link to="/" className="btn-outline-honey">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, t, s }: { icon: React.ReactNode; t: string; s: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-honey/20 text-honey-deep">{icon}</span>
      <div className="mt-3 font-display text-base text-charcoal">{t}</div>
      <div className="mt-1 text-xs text-muted-foreground">{s}</div>
    </div>
  );
}
