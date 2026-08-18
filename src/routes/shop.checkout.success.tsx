import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Check, ShoppingBag, Phone, Truck, Mail, Loader2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { formatKES } from "@/lib/products";

const search = z.object({
  order: z.string().optional(),
  method: z.enum(["mpesa", "card", "bank"]).optional(),
});

export const Route = createFileRoute("/shop/checkout/success")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Order Confirmed — Ntarakwai Shop" },
      { name: "description", content: "Your honey order has been received." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

interface OrderData {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "initiated" | "paid" | "failed";
  createdAt: string;
  paidAt?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
}

function Success() {
  const { order, method } = Route.useSearch();
  const isAutoChecking = method === "mpesa" || method === "card";
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!order) {
      setLoading(false);
      return;
    }

    let isActive = true;
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${order}`);
        if (!isActive) return;
        if (response.ok) {
          const data = await response.json();
          if (data?.order) {
            setOrderData(data.order);
          }
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchOrder();

    // If order is pending/initiated, poll every 3 seconds
    const interval = window.setInterval(() => {
      if (orderData?.paymentStatus === "paid" || orderData?.paymentStatus === "failed") {
        window.clearInterval(interval);
        return;
      }
      void fetchOrder();
    }, 3000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [order, orderData?.paymentStatus]);

  const paymentStatus = orderData?.paymentStatus ?? "pending";
  const isPaid = paymentStatus === "paid";
  const isFailed = paymentStatus === "failed";
  const isPending = paymentStatus === "initiated" || paymentStatus === "pending";

  return (
    <div className="bg-background pt-32 pb-20">
      <div className="container-luxe">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-[var(--shadow-card)] md:p-12">
            {/* Status Icon */}
            {isPaid ? (
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-cream shadow-lg">
                <Check className="h-9 w-9" strokeWidth={3} />
              </div>
            ) : isFailed ? (
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-cream shadow-lg">
                <AlertCircle className="h-9 w-9" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-honey to-honey-deep text-charcoal shadow-lg">
                <Loader2 className="h-9 w-9 animate-spin" />
              </div>
            )}

            {/* Header Title */}
            <h1 className="font-display mt-7 text-3xl text-charcoal md:text-4xl">
              {isPaid
                ? "Payment successful!"
                : isFailed
                ? "Payment wasn't completed"
                : method === "bank"
                ? "Bank transfer received"
                : "Waiting for payment…"}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-sm text-muted-foreground md:text-base max-w-lg mx-auto">
              {isPaid
                ? "Your payment was received and confirmed. We're carefully preparing your raw honey for dispatch."
                : isFailed
                ? "We couldn't confirm your M-PESA payment. No successful transaction was recorded for this order."
                : method === "bank"
                ? "Your bank payment receipt has been uploaded and is being verified by our team."
                : "We are awaiting confirmation from M-PESA. If you entered your PIN, this page will update automatically."}
            </p>

            {/* Order Card Metadata */}
            {order && (
              <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5 text-left text-xs text-charcoal sm:text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-muted-foreground block text-xs">Order Number</span>
                    <strong className="font-display text-base text-honey-deep">#{order}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Payment Method</span>
                    <strong className="capitalize">{orderData?.paymentMethod ?? method ?? "M-PESA"}</strong>
                  </div>
                  {orderData?.amount ? (
                    <div>
                      <span className="text-muted-foreground block text-xs">Total Amount</span>
                      <strong className="text-charcoal">{formatKES(orderData.amount)}</strong>
                    </div>
                  ) : null}
                  <div>
                    <span className="text-muted-foreground block text-xs">Payment Status</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold rounded-full px-2.5 py-0.5 text-xs ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-800"
                          : isFailed
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isPaid ? "Paid" : isFailed ? "Failed" : "Awaiting Confirmation"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Information Cards */}
            {isPaid && (
              <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
                <Card icon={<Mail className="h-5 w-5" />} t="Order receipt" s="Check your email for confirmation." />
                <Card icon={<Truck className="h-5 w-5" />} t="Dispatch" s="Courier tracking details will follow shortly." />
                <Card icon={<Phone className="h-5 w-5" />} t="Support" s="Call/WhatsApp +254 711 856 795" />
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {isPaid ? (
                <>
                  <Link to="/shop/products" className="btn-honey">
                    <ShoppingBag className="h-4 w-4" /> Continue shopping
                  </Link>
                  <Link to="/" className="btn-outline-honey">
                    Back to home
                  </Link>
                </>
              ) : isFailed ? (
                <>
                  <Link to="/shop/checkout" className="btn-honey">
                    <RefreshCw className="h-4 w-4" /> Try payment again
                  </Link>
                  <Link to="/shop/products" className="btn-outline-honey">
                    Return to shop
                  </Link>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="btn-outline-honey inline-flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Refresh status
                  </button>
                  <Link to="/shop/products" className="btn-honey">
                    Continue browsing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon, t, s }: { icon: React.ReactNode; t: string; s: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-honey/20 text-honey-deep">{icon}</span>
      <div className="mt-2.5 font-display text-sm text-charcoal">{t}</div>
      <div className="mt-1 text-xs text-muted-foreground">{s}</div>
    </div>
  );
}
