import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type FormEvent } from "react";
import { Check, ArrowRight, ArrowLeft, Smartphone, Landmark, Upload, ShieldCheck, Truck, Loader2, CreditCard, Building2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ntarakwai Shop" },
      { name: "description", content: "Securely complete your honey order with M-Pesa or bank transfer." },
    ],
  }),
  component: Checkout,
});

const DELIVERY_COUNTIES = [
  "Marsabit",
  "Isiolo",
  "Meru",
  "Laikipia",
  "Nairobi",
];

type Step = 1 | 2 | 3;
type PayMethod = "mpesa" | "card" | "bank";
type PaymentState = "idle" | "initiating" | "awaiting_payment" | "paid" | "failed" | "cancelled" | "timeout";

interface CustomerInfo {
  fullName: string; phone: string; email: string;
  county: string; town: string; landmark: string; address: string;
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
  useReveal();
  const navigate = useNavigate();
  const { resolved, subtotal, count, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [info, setInfo] = useState<CustomerInfo>({
    fullName: "", phone: "", email: "", county: "Nairobi", town: "", landmark: "", address: "",
  });
  const [payMethod, setPayMethod] = useState<PayMethod>("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [bankDate, setBankDate] = useState("");
  const [bankAmount, setBankAmount] = useState("");
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [bankNotes, setBankNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [activeOrderNumber, setActiveOrderNumber] = useState<string | null>(null);
  const [pollSeconds, setPollSeconds] = useState(0);

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
    const pollInterval = window.setInterval(async () => {
      setPollSeconds((prev) => {
        if (prev >= 60) {
          setPaymentState("timeout");
          window.clearInterval(pollInterval);
          return prev;
        }
        return prev + 2;
      });

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
      <div className="bg-background pt-32 pb-20">
        <div className="container-luxe mx-auto max-w-md text-center">
          <h1 className="font-display text-3xl text-charcoal">Your cart is empty</h1>
          <Link to="/shop/products" className="btn-honey mt-6 inline-flex">Browse products</Link>
        </div>
      </div>
    );
  }

  function handleStep1(e: FormEvent) {
    e.preventDefault();

    if (!DELIVERY_COUNTIES.includes(info.county)) {
      setError("We currently deliver only within Marsabit, Isiolo, Meru, Laikipia (Nanyuki), and Nairobi.");
      return;
    }

    if (info.county === "Laikipia" && info.town.trim().toLowerCase() !== "nanyuki") {
      setError("For Laikipia, delivery is currently available only in Nanyuki.");
      return;
    }

    if (!isValidKenyanPhone(info.phone)) {
      setError("Please enter a valid Kenyan phone number (e.g. 07XX XXX XXX or 01XX XXX XXX).");
      return;
    }

    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay() {
    if (submitting || paymentState === "initiating") return;

    const targetPhone = payMethod === "mpesa" ? (mpesaPhone || info.phone) : info.phone;

    if (payMethod === "mpesa") {
      if (!isValidKenyanPhone(targetPhone)) {
        setPhoneError("Please enter a valid M-PESA phone number (e.g. 07XX XXX XXX).");
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

      if (data.redirectUrl && data.redirectUrl.startsWith("http")) {
        clear();
        window.location.href = data.redirectUrl;
        return;
      }

      if (payMethod === "mpesa") {
        setPollSeconds(0);
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
      setError("We couldn't confirm the payment request. Please check your network and try again.");
    }
  }

  return (
    <div className="bg-background pt-28 pb-20">
      <div className="container-luxe">
        {/* Steps */}
        <div className="reveal mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            {[
              { n: 1, label: "Your details" },
              { n: 2, label: "Review order" },
              { n: 3, label: "Payment" },
            ].map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center">
                <div className={`flex items-center gap-3 ${step >= s.n ? "text-charcoal" : "text-muted-foreground"}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-colors ${step > s.n ? "bg-honey-deep text-cream" : step === s.n ? "bg-charcoal text-cream" : "bg-secondary text-muted-foreground"}`}>
                    {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">{s.label}</span>
                </div>
                {i < 2 && <div className={`mx-3 h-px flex-1 ${step > s.n ? "bg-honey-deep" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <div className="reveal">
            {step === 1 && (
              <form onSubmit={handleStep1} className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9">
                <h2 className="font-display text-3xl text-charcoal">Customer information</h2>
                <p className="mt-2 text-sm text-muted-foreground">Where should we deliver your honey?</p>

                <div className="mt-7 grid gap-5">
                  {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                  <Field label="Full Name" value={info.fullName} onChange={(v) => setInfo({ ...info, fullName: v })} required />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone Number" type="tel" placeholder="07XX XXX XXX" value={info.phone} onChange={(v) => setInfo({ ...info, phone: v })} required />
                    <Field label="Email" type="email" value={info.email} onChange={(v) => setInfo({ ...info, email: v })} required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-charcoal">
                      County
                      <select
                        value={info.county}
                        onChange={(e) => setInfo({ ...info, county: e.target.value })}
                        className="mt-1.5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
                      >
                        {DELIVERY_COUNTIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </label>
                    <Field label="Town" placeholder={info.county === "Laikipia" ? "Nanyuki" : "Town or area"} value={info.town} onChange={(v) => setInfo({ ...info, town: v })} required />
                  </div>
                  <Field label="Nearest Landmark" value={info.landmark} onChange={(v) => setInfo({ ...info, landmark: v })} placeholder="e.g. Junction Mall" required />
                  <label className="text-sm font-medium text-charcoal">
                    Delivery Address
                    <textarea
                      required value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })}
                      rows={3}
                      className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
                    />
                  </label>
                </div>

                <button type="submit" className="btn-honey mt-8 w-full sm:w-auto">
                  Continue to review <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9">
                <h2 className="font-display text-3xl text-charcoal">Review your order</h2>
                <p className="mt-2 text-sm text-muted-foreground">Confirm your products and delivery details.</p>

                <div className="mt-7 divide-y divide-border rounded-2xl border border-border bg-background">
                  {resolved.map(({ product, qty, lineTotal }) => (
                    <div key={product.id} className="flex items-center gap-4 p-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-display truncate text-base text-charcoal">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.weight} · Qty {qty}</div>
                      </div>
                      <div className="font-medium text-charcoal">{formatKES(lineTotal)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-background p-5 text-sm">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Deliver to</div>
                  <div className="mt-2 text-charcoal">
                    <div className="font-semibold">{info.fullName}</div>
                    <div>{info.address}, {info.town}, {info.county}</div>
                    <div className="text-muted-foreground">Near {info.landmark}</div>
                    <div className="mt-1 text-muted-foreground">{info.phone} · {info.email}</div>
                  </div>
                  <button onClick={() => setStep(1)} className="mt-3 text-xs font-semibold text-honey-deep hover:underline">Edit</button>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline-honey"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button onClick={() => setStep(3)} className="btn-honey">Continue to payment <ArrowRight className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-3xl text-charcoal">Payment Method</h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">Select your preferred secure payment option.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit SSL Encrypted
                  </div>
                </div>

                {/* Method selection grid */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {/* M-PESA Card */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("mpesa")}
                    className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      payMethod === "mpesa"
                        ? "border-emerald-600 bg-emerald-500/10 shadow-md ring-1 ring-emerald-500/20"
                        : "border-border bg-background hover:border-emerald-500/50 hover:bg-emerald-500/5"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-600 text-cream shadow-sm">
                          <Smartphone className="h-5.5 w-5.5" />
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          Instant
                        </span>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">M-PESA Express</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Receive a direct STK push prompt on your mobile phone.
                      </div>
                    </div>
                    {payMethod === "mpesa" && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </button>

                  {/* Card Payment Card */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("card")}
                    className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      payMethod === "card"
                        ? "border-charcoal bg-charcoal/5 shadow-md ring-1 ring-charcoal/20"
                        : "border-border bg-background hover:border-charcoal/40 hover:bg-charcoal/5"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-charcoal text-cream shadow-sm">
                          <CreditCard className="h-5.5 w-5.5" />
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border">
                          Coming Soon
                        </span>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">Credit / Debit Card</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Online Visa & Mastercard checkout via bank gateway.
                      </div>
                    </div>
                    {payMethod === "card" && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </button>

                  {/* Bank Transfer Card */}
                  <button
                    type="button"
                    onClick={() => setPayMethod("bank")}
                    className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      payMethod === "bank"
                        ? "border-honey-deep bg-honey/10 shadow-md ring-1 ring-honey/20"
                        : "border-border bg-background hover:border-honey/50 hover:bg-honey/5"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-honey/30 text-honey-dark shadow-sm">
                          <Landmark className="h-5.5 w-5.5" />
                        </span>
                        <span className="rounded-full bg-honey/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-honey-dark">
                          Paybill
                        </span>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">Bank Paybill</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Pay via Paybill or bank transfer & upload transaction details.
                      </div>
                    </div>
                    {payMethod === "bank" && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-honey-deep">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </button>
                </div>

                {/* Form Details Area */}
                {payMethod === "mpesa" && (
                  <div className="mt-8 space-y-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-cream">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base text-charcoal">M-PESA Express STK Push</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          An automated payment prompt will be dispatched to your phone. Enter your PIN to approve.
                        </p>
                      </div>
                    </div>
                    <Field
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
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive">
                        {phoneError}
                      </div>
                    )}
                  </div>
                )}

                {payMethod === "card" && (
                  <div className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base text-charcoal">Card Payments Coming Soon</h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          We are completing onboarding with our bank partners for direct Visa and Mastercard card acquiring. In the meantime, please complete your order using <strong>M-PESA Express</strong> (instant push prompt) or <strong>Bank Paybill</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod("mpesa")}
                        className="btn-honey text-xs py-2 px-4"
                      >
                        <Smartphone className="h-3.5 w-3.5" /> Pay with M-PESA Express
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayMethod("bank")}
                        className="btn-outline-honey text-xs py-2 px-4"
                      >
                        <Landmark className="h-3.5 w-3.5" /> Pay with Bank Paybill
                      </button>
                    </div>
                  </div>
                )}

                {payMethod === "bank" && (
                  <div className="mt-8 space-y-5">
                    <div className="rounded-2xl border border-border bg-background p-5">
                      <div className="text-xs font-semibold uppercase tracking-widest text-honey-deep">Bank & Paybill Details</div>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-muted-foreground">Payment Method</dt><dd className="font-medium text-charcoal">Paybill</dd></div>
                        <div><dt className="text-muted-foreground">Paybill Number</dt><dd className="font-medium text-charcoal">522533</dd></div>
                        <div><dt className="text-muted-foreground">Account Number</dt><dd className="font-medium text-charcoal">8122833</dd></div>
                        <div><dt className="text-muted-foreground">Account Name</dt><dd className="font-medium text-charcoal">Ntarakwai Honey</dd></div>
                      </dl>
                    </div>

                    <div className="text-sm font-semibold text-charcoal">Upload Proof of Payment</div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Payment Reference Number" value={bankRef} onChange={setBankRef} required />
                      <Field label="Transaction Date" type="date" value={bankDate} onChange={setBankDate} required />
                    </div>
                    <Field label={`Amount Paid (${formatKES(total)})`} type="number" value={bankAmount} onChange={setBankAmount} required />
                    <label className="block text-sm font-medium text-charcoal">
                      Upload Bank Slip / Receipt
                      <div className="mt-1.5 flex items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background p-5">
                        <Upload className="h-5 w-5 text-honey-deep" />
                        <input
                          type="file" accept="image/*,application/pdf"
                          onChange={(e) => setBankFile(e.target.files?.[0] ?? null)}
                          className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-honey file:px-4 file:py-2 file:text-xs file:font-semibold file:text-charcoal"
                        />
                        {bankFile && <span className="ml-auto text-xs text-muted-foreground">{bankFile.name}</span>}
                      </div>
                    </label>
                    <label className="block text-sm font-medium text-charcoal">
                      Additional Notes
                      <textarea value={bankNotes} onChange={(e) => setBankNotes(e.target.value)} rows={3} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30" />
                    </label>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline-honey"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button
                    onClick={handlePay}
                    disabled={
                      submitting ||
                      payMethod === "card" ||
                      (payMethod === "mpesa" && !(mpesaPhone || info.phone)) ||
                      (payMethod === "bank" && (!bankRef || !bankDate || !bankAmount))
                    }
                    className="btn-honey disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending payment request…</>
                    ) : payMethod === "card" ? (
                      <>Select M-PESA or Paybill to Pay</>
                    ) : (
                      <>Pay {formatKES(total)} <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>

                {error && <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-honey-deep" /> Your payment is processed securely. We never store card details.
                </div>
              </div>
            )}
          </div>

          {/* Modal / Dedicated Overlay: Awaiting Payment */}
          {(paymentState === "awaiting_payment" || paymentState === "timeout") && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl md:p-9 text-center space-y-6">
                <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <Smartphone className="h-10 w-10 animate-bounce" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl text-charcoal">Check your phone</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We've sent an M-PESA payment prompt to <strong className="text-charcoal">{formatMaskedPhone(mpesaPhone || info.phone)}</strong>
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/50 p-4 text-left space-y-2.5 text-xs text-charcoal">
                  <div className="flex items-center gap-2 font-medium text-emerald-800">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-[10px] font-bold">1</span>
                    Look for the M-PESA prompt on your phone screen
                  </div>
                  <div className="flex items-center gap-2 font-medium text-emerald-800">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-[10px] font-bold">2</span>
                    Confirm the amount is <strong>{formatKES(total)}</strong>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-emerald-800">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-[10px] font-bold">3</span>
                    Enter your M-PESA PIN to authorize payment
                  </div>
                </div>

                {paymentState === "awaiting_payment" ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-honey-deep">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Waiting for payment confirmation…
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 text-left">
                    <strong>Payment confirmation is taking longer than expected.</strong> If you already entered your PIN, please don't pay again — your order will be updated automatically as soon as the confirmation arrives.
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-2">
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
                      className="btn-honey w-full"
                    >
                      Check order status
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentState("idle");
                    }}
                    className="text-xs font-medium text-muted-foreground hover:text-charcoal transition underline"
                  >
                    Change payment details / Try another number
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <aside className="reveal h-fit rounded-3xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
            <h3 className="font-display text-xl text-charcoal">Order summary</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {resolved.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img src={product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-charcoal">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty}</div>
                  </div>
                  <div className="text-charcoal">{formatKES(lineTotal)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatKES(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatKES(delivery)}</span></div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-display text-base text-charcoal">Total</span>
                <span className="font-display text-2xl text-honey-deep">{formatKES(total)}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/70 p-3 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-honey-deep" />
              <span>Delivery via Via Wells Fargo or your preferred parcel courier — 1–3 business days.</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-charcoal">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none transition focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
      />
    </label>
  );
}
