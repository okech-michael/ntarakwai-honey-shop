import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Check, ArrowRight, ArrowLeft, Smartphone, Landmark, Upload, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/shop/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Honeyfield Shop" },
      { name: "description", content: "Securely complete your honey order with M-Pesa or bank transfer." },
    ],
  }),
  component: Checkout,
});

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Nyeri", "Meru",
  "Machakos", "Kakamega", "Kisii", "Kericho", "Embu", "Kitale", "Garissa", "Malindi", "Other",
];

type Step = 1 | 2 | 3;
type PayMethod = "mpesa" | "bank";

interface CustomerInfo {
  fullName: string; phone: string; email: string;
  county: string; town: string; landmark: string; address: string;
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

  const delivery = useMemo(() => {
    if (subtotal === 0) return 0;
    if (info.county === "Nairobi") return 250;
    if (["Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"].includes(info.county)) return 400;
    return 550;
  }, [info.county, subtotal]);
  const total = subtotal + delivery;

  if (count === 0 && !submitting) {
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
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePay() {
    setSubmitting(true);
    // Mock processing
    await new Promise((r) => setTimeout(r, 1800));
    const orderNumber = `HF${Date.now().toString().slice(-8)}`;
    clear();
    navigate({
      to: "/shop/checkout/success",
      search: { order: orderNumber, method: payMethod },
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
                        {COUNTIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </label>
                    <Field label="Town" value={info.town} onChange={(v) => setInfo({ ...info, town: v })} required />
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
                <h2 className="font-display text-3xl text-charcoal">Payment method</h2>
                <p className="mt-2 text-sm text-muted-foreground">Choose how you'd like to pay.</p>

                {/* Method toggle */}
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod("mpesa")}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${payMethod === "mpesa" ? "border-honey-deep bg-honey/10" : "border-border bg-background hover:border-honey/50"}`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-honey to-honey-deep text-charcoal">
                      <Smartphone className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-lg text-charcoal">M-PESA STK Push</div>
                      <div className="text-xs text-muted-foreground">Recommended · instant confirmation</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod("bank")}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${payMethod === "bank" ? "border-honey-deep bg-honey/10" : "border-border bg-background hover:border-honey/50"}`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-honey-dark">
                      <Landmark className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-lg text-charcoal">Bank Transfer</div>
                      <div className="text-xs text-muted-foreground">Upload proof · verified by admin</div>
                    </div>
                  </button>
                </div>

                {/* M-Pesa form */}
                {payMethod === "mpesa" && (
                  <div className="mt-7 space-y-5">
                    <div className="rounded-2xl border border-honey-deep/30 bg-honey/10 p-5 text-sm text-charcoal">
                      Enter the M-Pesa number to receive an STK Push. You'll be prompted to enter your M-Pesa PIN.
                    </div>
                    <Field label="M-Pesa Phone Number" type="tel" placeholder="07XX XXX XXX" value={mpesaPhone} onChange={setMpesaPhone} required />
                  </div>
                )}

                {/* Bank form */}
                {payMethod === "bank" && (
                  <div className="mt-7 space-y-5">
                    <div className="rounded-2xl border border-border bg-background p-5">
                      <div className="text-xs font-semibold uppercase tracking-widest text-honey-deep">Bank Details</div>
                      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <div><dt className="text-muted-foreground">Bank Name</dt><dd className="font-medium text-charcoal">Equity Bank Kenya</dd></div>
                        <div><dt className="text-muted-foreground">Account Name</dt><dd className="font-medium text-charcoal">Honeyfield Limited</dd></div>
                        <div><dt className="text-muted-foreground">Account Number</dt><dd className="font-medium text-charcoal">0100200300400</dd></div>
                        <div><dt className="text-muted-foreground">Branch</dt><dd className="font-medium text-charcoal">Westlands</dd></div>
                        <div><dt className="text-muted-foreground">Swift Code</dt><dd className="font-medium text-charcoal">EQBLKENA</dd></div>
                      </dl>
                    </div>

                    <div className="text-sm font-semibold text-charcoal">Upload Proof of Payment</div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Payment Reference Number" value={bankRef} onChange={setBankRef} required />
                      <Field label="Transaction Date" type="date" value={bankDate} onChange={setBankDate} required />
                    </div>
                    <Field label={`Amount Paid (${formatKES(total)})`} type="number" value={bankAmount} onChange={setBankAmount} required />
                    <label className="block text-sm font-medium text-charcoal">
                      Upload Bank Slip
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
                    disabled={submitting || (payMethod === "mpesa" && !mpesaPhone) || (payMethod === "bank" && (!bankRef || !bankDate || !bankAmount))}
                    className="btn-honey disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : <>Pay {formatKES(total)} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-honey-deep" /> Your payment is processed securely. We never store card details.
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
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatKES(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatKES(delivery)}</span></div>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="font-display text-base text-charcoal">Total</span>
                <span className="font-display text-2xl text-honey-deep">{formatKES(total)}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-secondary/70 p-3 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-honey-deep" />
              <span>Delivery via Wells Fargo Courier — 1–3 business days.</span>
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
