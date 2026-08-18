import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type FormEvent } from "react";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";
import { PaymentShell } from "@/components/payment/PaymentShell";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ntarakwai Honey" },
      { name: "description", content: "Complete your order of pure raw Mt. Kulal honey." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const DELIVERY_COUNTIES = [
  "Nairobi",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Laikipia",
];

type Step = "details" | "payment";
type PayMethod = "mpesa" | "bank" | "card";
type PaymentState = "idle" | "initiating" | "awaiting_payment" | "paid" | "failed" | "cancelled" | "timeout";

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  landmark: string;
  address: string;
}

function isValidKenyanPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-\+]/g, "");
  return /^(?:254|0)?([17]\d{8})$/.test(clean);
}

function formatMaskedPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  let local = digits;
  if (local.startsWith("254") && local.length === 12) {
    local = `0${local.slice(3)}`;
  }
  if (local.length >= 10) {
    return `${local.slice(0, 4)} ••• ••${local.slice(-3)}`;
  }
  return phone;
}

function Checkout() {
  const navigate = useNavigate();
  const { resolved, subtotal, count, clear } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [info, setInfo] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    county: "Nairobi",
    town: "",
    landmark: "",
    address: "",
  });
  const [payMethod, setPayMethod] = useState<PayMethod>("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [bankDate, setBankDate] = useState("");
  const [bankNotes, setBankNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [activeOrderNumber, setActiveOrderNumber] = useState<string | null>(null);
  const [showOrderItems, setShowOrderItems] = useState(false);

  const delivery = useMemo(() => {
    if (subtotal === 0) return 0;
    if (info.county === "Nairobi") return 250;
    if (["Marsabit", "Isiolo", "Meru", "Laikipia"].includes(info.county)) return 550;
    return 0;
  }, [info.county, subtotal]);
  const total = subtotal + delivery;

  // Poll payment status when in awaiting_payment state
  useEffect(() => {
    if (paymentState !== "awaiting_payment" || !activeOrderNumber) return;

    let isMounted = true;
    let pollCount = 0;

    const pollInterval = window.setInterval(async () => {
      pollCount += 1;
      if (pollCount >= 25) {
        // ~60 seconds timeout
        setPaymentState("timeout");
        window.clearInterval(pollInterval);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${activeOrderNumber}`);
        if (!isMounted || !res.ok) return;
        const data = await res.json();
        const status = data?.order?.paymentStatus;

        if (status === "paid") {
          setPaymentState("paid");
          window.clearInterval(pollInterval);
          clear();
          navigate({
            to: "/shop/checkout/success",
            search: { order: activeOrderNumber, method: payMethod },
          });
        } else if (status === "failed") {
          setPaymentState("failed");
          window.clearInterval(pollInterval);
          setError("Your M-PESA payment was not completed or was cancelled. Please try again.");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2500);

    return () => {
      isMounted = false;
      window.clearInterval(pollInterval);
    };
  }, [paymentState, activeOrderNumber, clear, navigate, payMethod]);

  if (count === 0 && !submitting && paymentState !== "awaiting_payment") {
    return (
      <PaymentShell>
        <div className="text-center py-12">
          <h1 className="font-display text-2xl text-charcoal">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add items to your cart to proceed with checkout.</p>
          <div className="mt-6">
            <Link to="/shop/products" className="btn-honey text-xs py-2.5 px-6">
              Browse products
            </Link>
          </div>
        </div>
      </PaymentShell>
    );
  }

  function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault();

    if (!DELIVERY_COUNTIES.includes(info.county)) {
      setError("We currently deliver within Nairobi, Marsabit, Isiolo, Meru, and Laikipia (Nanyuki).");
      return;
    }

    if (info.county === "Laikipia" && info.town.trim().toLowerCase() !== "nanyuki") {
      setError("For Laikipia, delivery is currently available only in Nanyuki.");
      return;
    }

    if (!isValidKenyanPhone(info.phone)) {
      setError("Please enter a valid Kenyan phone number (e.g. 07XX XXX XXX).");
      return;
    }

    setError("");
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay() {
    if (submitting || paymentState === "initiating") return;

    const targetPhone = payMethod === "mpesa" ? (mpesaPhone || info.phone) : info.phone;

    if (payMethod === "mpesa") {
      if (!isValidKenyanPhone(targetPhone)) {
        setPhoneError("Please enter a valid M-PESA phone number.");
        return;
      }
      setPhoneError("");
    }

    setSubmitting(true);
    setPaymentState("initiating");
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: resolved.map(({ product, qty }) => ({ productId: product.id, qty })),
          customer: {
            fullName: info.fullName,
            phone: info.phone,
            email: info.email,
            county: info.county,
            town: info.town,
            landmark: info.landmark,
            address: info.address,
          },
          paymentMethod: payMethod,
          phone: targetPhone,
          amount: total,
          bankDetails: payMethod === "bank" ? {
            referenceNumber: bankRef,
            transactionDate: bankDate,
            notes: bankNotes,
          } : undefined,
        }),
      });

      const data = await response.json();
      setSubmitting(false);

      if (!response.ok || !data?.ok) {
        setPaymentState("failed");
        setError(data?.error ?? "We could not process this order right now. Please try again.");
        return;
      }

      const orderNum = data.orderNumber;
      setActiveOrderNumber(orderNum);

      if (payMethod === "mpesa") {
        setPaymentState("awaiting_payment");
      } else {
        clear();
        navigate({
          to: "/shop/checkout/success",
          search: { order: orderNum, method: payMethod },
        });
      }
    } catch (err) {
      setSubmitting(false);
      setPaymentState("failed");
      setError("We couldn't reach the payment service. Please check your network and try again.");
    }
  }

  // ==========================================
  // RENDER: AWAITING PAYMENT (In-Place Flow)
  // ==========================================
  if (paymentState === "awaiting_payment" || paymentState === "timeout") {
    const displayPhone = formatMaskedPhone(mpesaPhone || info.phone);

    return (
      <PaymentShell showBack={false}>
        <div className="space-y-8 text-center py-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-honey-deep">
              M-PESA Express
            </div>
            <h1 className="font-display text-3xl text-charcoal mt-1.5">
              Check your phone
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
              We sent a payment prompt for <strong className="text-charcoal">{formatKES(total)}</strong> to <span className="font-mono text-charcoal font-medium">{displayPhone}</span>.
            </p>
          </div>

          {/* Simple Clean Instruction List */}
          <div className="border-y border-border/80 py-5 text-left space-y-3 text-xs text-charcoal">
            <div className="flex items-start gap-3">
              <span className="font-mono text-muted-foreground">01</span>
              <span>Look for the M-PESA prompt on your phone screen.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-muted-foreground">02</span>
              <span>Confirm the business name is <strong>Ntarakwai Honey</strong>.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-muted-foreground">03</span>
              <span>Enter your M-PESA PIN to authorize payment.</span>
            </div>
          </div>

          {/* Status Indicator */}
          {paymentState === "awaiting_payment" ? (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/80">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              Waiting for confirmation…
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-xs text-muted-foreground text-left">
              <strong className="text-charcoal block mb-1">Confirmation is taking longer than usual</strong>
              If you already entered your PIN on your phone, please don't pay again. Your order will be updated automatically as soon as the network confirms it.
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            {paymentState === "timeout" && activeOrderNumber && (
              <button
                type="button"
                onClick={() => {
                  clear();
                  navigate({
                    to: "/shop/checkout/success",
                    search: { order: activeOrderNumber, method: "mpesa" },
                  });
                }}
                className="w-full rounded-full bg-charcoal text-cream py-3 text-xs font-semibold hover:bg-charcoal/90 transition"
              >
                Check order status
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setPaymentState("idle");
              }}
              className="text-xs text-muted-foreground hover:text-charcoal transition underline"
            >
              Use a different phone number
            </button>
          </div>
        </div>
      </PaymentShell>
    );
  }

  // ==========================================
  // RENDER: STEP 1 (Delivery & Customer Details)
  // ==========================================
  if (step === "details") {
    return (
      <PaymentShell backHref="/shop/cart">
        <form onSubmit={handleDetailsSubmit} className="space-y-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Step 1 of 2
            </div>
            <h1 className="font-display text-3xl text-charcoal mt-1">
              Delivery details
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Where should we send your Ntarakwai honey?
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <MinimalField
              label="Full Name"
              value={info.fullName}
              onChange={(v) => setInfo({ ...info, fullName: v })}
              placeholder="e.g. Ledany Timothy"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MinimalField
                label="Phone Number"
                type="tel"
                value={info.phone}
                onChange={(v) => setInfo({ ...info, phone: v })}
                placeholder="07XX XXX XXX"
                required
              />
              <MinimalField
                label="Email Address"
                type="email"
                value={info.email}
                onChange={(v) => setInfo({ ...info, email: v })}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-xs font-medium text-charcoal">
                County
                <select
                  value={info.county}
                  onChange={(e) => setInfo({ ...info, county: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-charcoal outline-none focus:border-charcoal transition"
                >
                  {DELIVERY_COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <MinimalField
                label="Town / Area"
                value={info.town}
                onChange={(v) => setInfo({ ...info, town: v })}
                placeholder={info.county === "Laikipia" ? "Nanyuki" : "Town or neighborhood"}
                required
              />
            </div>

            <MinimalField
              label="Nearest Landmark"
              value={info.landmark}
              onChange={(v) => setInfo({ ...info, landmark: v })}
              placeholder="e.g. Near Shell Station or Junction Mall"
              required
            />

            <label className="block text-xs font-medium text-charcoal">
              Street / Building Address
              <textarea
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                placeholder="Apartment, suite, or office details"
                rows={2}
                required
                className="mt-1 w-full rounded-lg border border-border bg-background p-3 text-xs text-charcoal outline-none focus:border-charcoal transition"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-full bg-charcoal text-cream py-3 text-xs font-semibold hover:bg-charcoal/90 transition flex items-center justify-center gap-2"
            >
              Continue to payment ({formatKES(total)}) →
            </button>
          </div>
        </form>
      </PaymentShell>
    );
  }

  // ==========================================
  // RENDER: STEP 2 (Payment Execution)
  // ==========================================
  return (
    <PaymentShell
      showBack={true}
      onBack={() => setStep("details")}
    >
      <div className="space-y-8">
        {/* Total Header Section */}
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Total amount due
          </div>
          <div className="font-display text-4xl sm:text-5xl text-charcoal mt-1">
            {formatKES(total)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Delivering to <strong className="text-charcoal">{info.fullName}</strong> in {info.town}, {info.county}
          </div>

          {/* Collapsible Order Breakdown */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowOrderItems(!showOrderItems)}
              className="text-[11px] text-muted-foreground hover:text-charcoal transition underline"
            >
              {showOrderItems ? "Hide summary" : `View ${count} item${count > 1 ? "s" : ""} breakdown`}
            </button>

            {showOrderItems && (
              <div className="mt-3 border border-border/70 rounded-lg p-3 text-left text-xs bg-secondary/30 space-y-2">
                {resolved.map(({ product, qty, lineTotal }) => (
                  <div key={product.id} className="flex justify-between items-center text-charcoal/90">
                    <span>{product.name} × {qty}</span>
                    <span className="font-mono">{formatKES(lineTotal)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between text-muted-foreground">
                  <span>Delivery ({info.county})</span>
                  <span className="font-mono">{formatKES(delivery)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Payment Method Switcher */}
        <div className="space-y-4">
          <div className="flex border border-border rounded-lg p-1 bg-secondary/40 gap-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setPayMethod("mpesa")}
              className={`flex-1 py-2 rounded-md transition ${
                payMethod === "mpesa"
                  ? "bg-background text-charcoal shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              M-PESA Express
            </button>
            <button
              type="button"
              onClick={() => setPayMethod("bank")}
              className={`flex-1 py-2 rounded-md transition ${
                payMethod === "bank"
                  ? "bg-background text-charcoal shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              Bank Paybill
            </button>
            <button
              type="button"
              onClick={() => setPayMethod("card")}
              className={`flex-1 py-2 rounded-md transition opacity-60 ${
                payMethod === "card"
                  ? "bg-background text-charcoal shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-charcoal"
              }`}
            >
              Card (Soon)
            </button>
          </div>

          {/* M-PESA Form */}
          {payMethod === "mpesa" && (
            <div className="space-y-4 pt-1">
              <div>
                <MinimalField
                  label="M-PESA Phone Number"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={mpesaPhone || info.phone}
                  onChange={(v) => {
                    setMpesaPhone(v);
                    if (phoneError) setPhoneError("");
                  }}
                  required
                />
                {phoneError && (
                  <div className="mt-1 text-[11px] text-destructive">
                    {phoneError}
                  </div>
                )}
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  You will receive a prompt on this phone to enter your M-PESA PIN.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={submitting || paymentState === "initiating"}
                  className="w-full rounded-full bg-charcoal text-cream py-3.5 text-xs font-semibold hover:bg-charcoal/90 disabled:opacity-60 transition"
                >
                  {submitting ? "Sending prompt to your phone…" : `Pay ${formatKES(total)} with M-PESA`}
                </button>
              </div>
            </div>
          )}

          {/* Bank Paybill Form */}
          {payMethod === "bank" && (
            <div className="space-y-4 pt-1">
              <div className="border border-border/80 rounded-lg p-4 bg-secondary/20 text-xs space-y-2">
                <div className="font-semibold text-charcoal uppercase tracking-wider text-[10px]">
                  KCB Bank Paybill
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Number:</span>
                  <strong className="font-mono text-charcoal">522533</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <strong className="font-mono text-charcoal">8122833</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Name:</span>
                  <span className="text-charcoal font-medium">Ntarakwai Honey</span>
                </div>
              </div>

              <MinimalField
                label="M-PESA / Bank Reference Code"
                value={bankRef}
                onChange={setBankRef}
                placeholder="e.g. RKG8192301"
                required
              />

              <MinimalField
                label="Transaction Date"
                type="date"
                value={bankDate}
                onChange={setBankDate}
                required
              />

              <MinimalField
                label="Additional Notes (Optional)"
                value={bankNotes}
                onChange={setBankNotes}
                placeholder="Any payment or courier details"
              />

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={submitting || !bankRef || !bankDate}
                  className="w-full rounded-full bg-charcoal text-cream py-3.5 text-xs font-semibold hover:bg-charcoal/90 disabled:opacity-60 transition"
                >
                  {submitting ? "Confirming order…" : `Confirm ${formatKES(total)} Payment`}
                </button>
              </div>
            </div>
          )}

          {/* Card Coming Soon Notice */}
          {payMethod === "card" && (
            <div className="border border-border/80 rounded-lg p-5 bg-secondary/20 text-center space-y-3">
              <div className="text-xs font-semibold text-charcoal">
                Card Checkout is Coming Soon
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct online card acquiring is currently being finalized with our bank. Please complete your order with <strong>M-PESA Express</strong> or <strong>Bank Paybill</strong>.
              </p>
              <button
                type="button"
                onClick={() => setPayMethod("mpesa")}
                className="w-full rounded-full bg-charcoal text-cream py-2.5 text-xs font-semibold hover:bg-charcoal/90 transition"
              >
                Switch to M-PESA Express
              </button>
            </div>
          )}
        </div>
      </div>
    </PaymentShell>
  );
}

function MinimalField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-charcoal">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-charcoal outline-none focus:border-charcoal transition"
      />
    </label>
  );
}
