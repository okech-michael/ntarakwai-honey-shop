import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { Building2, Hotel, ShoppingBag, Truck, BadgeCheck, Phone, MessageCircle, Check } from "lucide-react";
import gift from "@/assets/product-gift.jpg";
import production from "@/assets/gallery-production.jpg";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale Honey Supply — Retailers, Hotels & Distributors" },
      { name: "description", content: "Reliable bulk supply of premium honey and bee products for supermarkets, hotels, restaurants and distributors." },
      { property: "og:title", content: "Honeyfield Wholesale" },
      { property: "og:description", content: "Bulk premium honey supply across Kenya." },
      { property: "og:image", content: production },
    ],
  }),
  component: Wholesale,
});

function Wholesale() {
  useReveal();
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Wholesale"
        image={production}
        title={<>Bulk supply with <em className="text-honey">unwavering quality</em>.</>}
        subtitle="Trusted partner to supermarkets, hotels, restaurants and distributors across East Africa."
      >
        <a href="tel:+254711856795" className="btn-honey"><Phone className="h-4 w-4" /> +254 711 856 795</a>
      </PageHero>

      <section className="bg-background py-24">
        <div className="container-luxe">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">We supply</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Partners across the value chain</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShoppingBag, t: "Retailers" },
              { icon: Building2, t: "Supermarkets" },
              { icon: Hotel, t: "Hotels & Restaurants" },
              { icon: Truck, t: "Distributors" },
            ].map((p, i) => (
              <div key={p.t} className="reveal rounded-3xl border border-border bg-card p-7 text-center shadow-sm" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-honey/20 text-honey-deep"><p.icon className="h-6 w-6" /></span>
                <div className="font-display mt-5 text-xl text-charcoal">{p.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="container-luxe grid items-center gap-14 md:grid-cols-2">
          <img src={gift} alt="Premium honey gift box" className="reveal rounded-[2rem] shadow-[var(--shadow-card)]" loading="lazy" width={896} height={1152} />
          <div className="reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Partnership benefits</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Built for your business</h2>
            <ul className="mt-8 space-y-4">
              {[
                "Consistent monthly volumes",
                "Custom labels & private branding",
                "Lab-tested, fully traceable batches",
                "Flexible packaging — 250g to 25kg",
                "Reliable delivery across Kenya",
                "Dedicated account manager",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-honey text-charcoal"><Check className="h-3.5 w-3.5" /></span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container-luxe grid gap-12 md:grid-cols-2">
          <div className="reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Request a quotation</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Tell us what you need</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Share your volume, packaging and timeline. Our team will respond within one business day.</p>
            <div className="mt-8 rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-honey-deep" />
                <span className="text-sm">Lab-tested · Traceable · ISO-aligned</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="tel:+254711856795" className="btn-honey text-sm"><Phone className="h-4 w-4" /> Call sales</a>
                <a href="https://wa.me/254711856795" target="_blank" rel="noreferrer" className="btn-outline-honey text-sm"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </div>

          <form
            className="reveal rounded-3xl border border-border bg-card p-8 shadow-sm"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            {sent ? (
              <div className="grid h-full place-items-center py-16 text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-honey/30 text-honey-dark"><Check className="h-6 w-6" /></div>
                  <h3 className="font-display mt-5 text-2xl text-charcoal">Quotation request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We'll be in touch within one business day.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <Field label="Company name" name="company" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Contact name" name="name" />
                  <Field label="Phone" name="phone" type="tel" />
                </div>
                <Field label="Email" name="email" type="email" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Product of interest" name="product" placeholder="e.g. Pure honey 500g" />
                  <Field label="Estimated volume" name="volume" placeholder="e.g. 200 jars / month" />
                </div>
                <label className="text-sm font-medium text-charcoal">
                  Message
                  <textarea required name="message" rows={4} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-honey-deep focus:ring-2 focus:ring-honey/30" />
                </label>
                <button type="submit" className="btn-honey mt-2 w-full">Request quotation</button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="text-sm font-medium text-charcoal">
      {label}
      <input
        required
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none transition focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
      />
    </label>
  );
}
