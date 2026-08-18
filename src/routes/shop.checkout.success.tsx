import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { formatKES } from "@/lib/products";
import { PaymentShell } from "@/components/payment/PaymentShell";

const search = z.object({
  order: z.string().optional(),
  method: z.enum(["mpesa", "card", "bank"]).optional(),
});

export const Route = createFileRoute("/shop/checkout/success")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Order Receipt — Ntarakwai Honey" },
      { name: "description", content: "Your Ntarakwai order confirmation and receipt." },
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
    town?: string;
    county?: string;
  };
  items?: Array<{
    productId: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

function Success() {
  const { order, method } = Route.useSearch();
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
    <PaymentShell showBack={false}>
      <div className="space-y-8 text-center py-4">
        {/* Header / Amount Hero */}
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            {isPaid ? "Payment confirmed" : isFailed ? "Payment not completed" : "Payment in progress"}
          </div>

          <h1 className="font-display text-4xl text-charcoal mt-1">
            {orderData?.amount ? formatKES(orderData.amount) : "Ntarakwai Order"}
          </h1>

          <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
            {isPaid
              ? "Your payment was received and your order of raw Mt. Kulal honey is being prepared for dispatch."
              : isFailed
              ? "We couldn't record a completed payment for this order. No funds were captured."
              : method === "bank"
              ? "Your bank transfer reference has been recorded and is pending account verification."
              : "We are awaiting confirmation from M-PESA. This page will update automatically."}
          </p>
        </div>

        {/* Receipt Key-Value Details */}
        {order && (
          <div className="border-y border-border/80 py-4 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Reference</span>
              <span className="font-mono text-charcoal font-medium">#{order}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="text-charcoal capitalize">{orderData?.paymentMethod ?? method ?? "M-PESA"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`font-semibold ${
                  isPaid
                    ? "text-emerald-700"
                    : isFailed
                    ? "text-red-700"
                    : "text-amber-700"
                }`}
              >
                {isPaid ? "Paid & Confirmed" : isFailed ? "Failed / Incomplete" : "Awaiting Verification"}
              </span>
            </div>

            {orderData?.customer?.fullName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deliver To</span>
                <span className="text-charcoal">{orderData.customer.fullName} ({orderData.customer.town})</span>
              </div>
            )}
          </div>
        )}

        {/* Primary Next Actions */}
        <div className="pt-2 flex flex-col gap-2.5">
          {isPaid ? (
            <>
              <Link
                to="/shop/products"
                className="w-full rounded-full bg-charcoal text-cream py-3 text-xs font-semibold hover:bg-charcoal/90 transition text-center"
              >
                Continue browsing
              </Link>
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-charcoal transition underline"
              >
                Return to home
              </Link>
            </>
          ) : isFailed ? (
            <>
              <Link
                to="/shop/checkout"
                className="w-full rounded-full bg-charcoal text-cream py-3 text-xs font-semibold hover:bg-charcoal/90 transition text-center"
              >
                Try payment again
              </Link>
              <Link
                to="/shop/products"
                className="text-xs text-muted-foreground hover:text-charcoal transition underline"
              >
                Return to shop
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-full border border-border py-2.5 text-xs font-semibold text-charcoal hover:bg-secondary/40 transition"
            >
              Refresh payment status
            </button>
          )}
        </div>
      </div>
    </PaymentShell>
  );
}
