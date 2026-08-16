import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Landmark,
  Upload,
  ShieldCheck,
  Truck,
  Loader2,
  CreditCard,
  Building2,
} from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout: Ntarakwai Shop" },
      {
        name: "description",
        content: "Securely complete your honey order with M-Pesa or bank transfer.",
      },
    ],
  }),
  component: Checkout,
});

const DELIVERY_COUNTIES = ["Marsabit", "Isiolo", "Meru", "Laikipia", "Nairobi"];

type Step = 1 | 2 | 3;
type PayMethod = "mpesa" | "card" | "bank";

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  county: string;
  town: string;
  landmark: string;
  address: string;
}

function Checkout() {
  useReveal();
  const navigate = useNavigate();
  const { resolved, subtotal, count, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
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
  const [bankAmount, setBankAmount] = useState("");
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [bankNotes, setBankNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const delivery = useMemo(() => {
    if (subtotal === 0) return 0;
    if (info.county === "Nairobi") return 250;
    if (["Marsabit", "Isiolo", "Meru", "Laikipia"].includes(info.county)) return 550;
    return 0;
  }, [info.county, subtotal]);
  const total = subtotal + delivery;

  if (count === 0 && !submitting) {
    return (
      <div className="bg-background pt-32 pb-20">
        <div className="container-luxe mx-auto max-w-md text-center">
          <h1 className="font-display text-3xl text-charcoal">Your cart is empty</h1>
          <Link to="/shop/products" className="btn-honey mt-6 inline-flex">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  function handleStep1(e: FormEvent) {
    e.preventDefault();

    if (!DELIVERY_COUNTIES.includes(info.county)) {
      setError(
        "We currently deliver only within Marsabit, Isiolo, Meru, Laikipia (Nanyuki), and Nairobi.",
      );
      return;
    }

    if (info.county === "Laikipia" && info.town.trim().toLowerCase() !== "nanyuki") {
      setError("For Laikipia, delivery is currently available only in Nanyuki.");
      return;
    }

    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay() {
    setSubmitting(true);
    setError("");

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
        phone: payMethod === "mpesa" ? (mpesaPhone || info.phone) : undefined,
        amount: total,
      }),
    });

    const data = await response.json();
    setSubmitting(false);

    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "We could not process this order right now.");
      return;
    }

    clear();

    if (data.redirectUrl && data.redirectUrl.startsWith("http")) {
      window.location.href = data.redirectUrl;
      return;
    }

    navigate({
      to: "/shop/checkout/success",
      search: { order: data.orderNumber, method: payMethod },
    });
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
                <div
                  className={`flex items-center gap-3 ${step >= s.n ? "text-charcoal" : "text-muted-foreground"}`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition-colors ${step > s.n ? "bg-honey-deep text-cream" : step === s.n ? "bg-charcoal text-cream" : "bg-secondary text-muted-foreground"}`}
                  >
                    {step > s.n ? <Check className="h-4 w-4" /> : s.n}
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">{s.label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={`mx-3 h-px flex-1 ${step > s.n ? "bg-honey-deep" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main */}
          <div className="reveal">
            {step === 1 && (
              <form
                onSubmit={handleStep1}
                className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9"
              >
                <h2 className="font-display text-3xl text-charcoal">Customer information</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Where should we deliver your honey?
                </p>

                <div className="mt-7 grid gap-5">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <Field
                    label="Full Name"
                    value={info.fullName}
                    onChange={(v) => setInfo({ ...info, fullName: v })}
                    required
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Phone Number"
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={info.phone}
                      onChange={(v) => setInfo({ ...info, phone: v })}
                      required
                    />
                    <Field
                      label="Email"
                      type="email"
                      value={info.email}
                      onChange={(v) => setInfo({ ...info, email: v })}
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-charcoal">
                      County
                      <select
                        value={info.county}
                        onChange={(e) => setInfo({ ...info, county: e.target.value })}
                        className="mt-1.5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
                      >
                        {DELIVERY_COUNTIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <Field
                      label="Town"
                      placeholder={info.county === "Laikipia" ? "Nanyuki" : "Town or area"}
                      value={info.town}
                      onChange={(v) => setInfo({ ...info, town: v })}
                      required
                    />
                  </div>
                  <Field
                    label="Nearest Landmark"
                    value={info.landmark}
                    onChange={(v) => setInfo({ ...info, landmark: v })}
                    placeholder="e.g. Junction Mall"
                    required
                  />
                  <label className="text-sm font-medium text-charcoal">
                    Delivery Address
                    <textarea
                      required
                      value={info.address}
                      onChange={(e) => setInfo({ ...info, address: e.target.value })}
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
                <p className="mt-2 text-sm text-muted-foreground">
                  Confirm your products and delivery details.
                </p>

                <div className="mt-7 divide-y divide-border rounded-2xl border border-border bg-background">
                  {resolved.map(({ product, qty, lineTotal }) => (
                    <div key={product.id} className="flex items-center gap-4 p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-display truncate text-base text-charcoal">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.weight} · Qty {qty}
                        </div>
                      </div>
                      <div className="font-medium text-charcoal">{formatKES(lineTotal)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-background p-5 text-sm">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Deliver to
                  </div>
                  <div className="mt-2 text-charcoal">
                    <div className="font-semibold">{info.fullName}</div>
                    <div>
                      {info.address}, {info.town}, {info.county}
                    </div>
                    <div className="text-muted-foreground">Near {info.landmark}</div>
                    <div className="mt-1 text-muted-foreground">
                      {info.phone} · {info.email}
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-3 text-xs font-semibold text-honey-deep hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline-honey">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-honey">
                    Continue to payment <ArrowRight className="h-4 w-4" />
                  </button>
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
                        ? "border-green-600 bg-green-50 shadow-md ring-1 ring-green-600/20"
                        : "border-border bg-background hover:border-green-400 hover:bg-green-50/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-600 text-cream shadow-sm">
                          <Smartphone className="h-5.5 w-5.5" />
                        </span>
                        <span className="rounded bg-background px-2 py-1 text-[10px] font-bold text-green-700 border border-green-200">INSTANT</span>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">M-PESA Express</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Receive a direct STK push prompt on your mobile phone.
                      </div>
                    </div>
                    {payMethod === "mpesa" && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-700">
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
                        <div className="flex items-center gap-1">
                          <span className="rounded bg-background px-1.5 py-0.5 text-[10px] font-bold text-charcoal border border-border">VISA</span>
                          <span className="rounded bg-background px-1.5 py-0.5 text-[10px] font-bold text-charcoal border border-border">MC</span>
                        </div>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">Credit / Debit Card</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Pay securely with Visa, Mastercard, or prepaid cards.
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
                        ? "border-amber-600 bg-amber-50 shadow-md ring-1 ring-amber-600/20"
                        : "border-border bg-background hover:border-amber-300 hover:bg-amber-50/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-600 text-cream shadow-sm">
                          <Building2 className="h-5.5 w-5.5" />
                        </span>
                        <span className="rounded bg-background px-2 py-1 text-[10px] font-bold text-amber-700 border border-amber-200">PAYBILL</span>
                      </div>
                      <div className="mt-4 font-display text-lg text-charcoal">Bank Paybill</div>
                      <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Pay via Paybill or bank transfer & upload transaction details.
                      </div>
                    </div>
                    {payMethod === "bank" && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                        <Check className="h-3.5 w-3.5" /> Selected
                      </div>
                    )}
                  </button>
                </div>

                {/* Form Details Area */}
                {payMethod === "mpesa" && (
                  <div className="mt-8 space-y-5 rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-600 text-cream">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base text-charcoal">M-PESA Express STK Push</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          An automated payment prompt will be dispatched to your phone. Enter your PIN to approve.
                        </p>
                      </div>
                    </div>
                    <div className="mt-7 space-y-5">
                      <Field
                        label="M-Pesa Phone Number"
                        type="tel"
                        placeholder="07XX XXX XXX"
                        value={mpesaPhone || info.phone}
                        onChange={setMpesaPhone}
                        required
                      />
                    </div>
                  </div>
                )}

                {payMethod === "card" && (
                  <div className="mt-8 space-y-5 rounded-2xl border border-charcoal/15 bg-card p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-charcoal text-cream">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-display text-base text-charcoal">Secure Card Payment Gateway</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Click <strong>Pay {formatKES(total)}</strong> below to launch the PCI-DSS compliant secure bank payment gateway.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-charcoal font-medium">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" /> Guaranteed Bank Security
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your card details are processed directly by our bank's encrypted payment gateway. Ntarakwai never sees or stores your full card numbers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === "bank" && (
                  <div className="mt-8 space-y-5">
                    <div className="rounded-2xl border border-border bg-background p-5">
                      <div className="text-xs font-semibold uppercase tracking-widest text-honey-deep">
                        Bank Details
                      </div>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-muted-foreground">Payment Method</dt>
                          <dd className="font-medium text-charcoal">Paybill</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Paybill</dt>
                          <dd className="font-medium text-charcoal">522533</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Account Number</dt>
                          <dd className="font-medium text-charcoal">8122833</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Account Name</dt>
                          <dd className="font-medium text-charcoal">Ntarakwai</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="text-sm font-semibold text-charcoal">
                      Upload Proof of Payment
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Payment Reference Number"
                        value={bankRef}
                        onChange={setBankRef}
                        required
                      />
                      <Field
                        label="Transaction Date"
                        type="date"
                        value={bankDate}
                        onChange={setBankDate}
                        required
                      />
                    </div>
                    <Field
                      label={`Amount Paid (${formatKES(total)})`}
                      type="number"
                      value={bankAmount}
                      onChange={setBankAmount}
                      required
                    />
                    <label className="block text-sm font-medium text-charcoal">
                      Upload Bank Slip / Receipt
                      <div className="mt-1.5 flex items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background p-5">
                        <Upload className="h-5 w-5 text-honey-deep" />
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setBankFile(e.target.files?.[0] ?? null)}
                          className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-honey file:px-4 file:py-2 file:text-xs file:font-semibold file:text-charcoal"
                        />
                        {bankFile && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {bankFile.name}
                          </span>
                        )}
                      </div>
                    </label>
                    <label className="block text-sm font-medium text-charcoal">
                      Additional Notes
                      <textarea
                        value={bankNotes}
                        onChange={(e) => setBankNotes(e.target.value)}
                        rows={3}
                        className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
                      />
                    </label>
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline-honey">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={
                      submitting ||
                      (payMethod === "mpesa" && !(mpesaPhone || info.phone)) ||
                      (payMethod === "bank" && (!bankRef || !bankDate || !bankAmount))
                    }
                    className="btn-honey disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>
                        Pay {formatKES(total)} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-honey-deep" /> Your payment is processed
                  securely. We never store card details.
                </div>
              </div>
            )}
          </div>

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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatKES(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatKES(delivery)}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-display text-base text-charcoal">Total</span>
                <span className="font-display text-2xl text-honey-deep">{formatKES(total)}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/70 p-3 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-honey-deep" />
              <span>
                Delivery via Via Wells Fargo or your preferred parcel courier, 1–3 business days.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
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
