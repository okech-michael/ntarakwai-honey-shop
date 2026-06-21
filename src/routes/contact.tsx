import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { Phone, Mail, MapPin, Clock, MessageCircle, Check } from "lucide-react";
import honeycomb from "@/assets/honeycomb.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Honeyfield" },
      { name: "description", content: "Get in touch with Honeyfield for orders, wholesale enquiries and partnerships. Call +254 711 856 795." },
      { property: "og:title", content: "Contact Honeyfield" },
      { property: "og:description", content: "We'd love to hear from you." },
      { property: "og:image", content: honeycomb },
    ],
  }),
  component: Contact,
});

function Contact() {
  useReveal();
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        image={honeycomb}
        title={<>Let's talk <em className="text-honey">honey</em>.</>}
        subtitle="Reach out for orders, wholesale enquiries, partnerships or a friendly hello."
      >
        <a href="tel:+254711856795" className="btn-honey"><Phone className="h-4 w-4" /> Call +254 711 856 795</a>
        <a href="https://wa.me/254711856795" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream hover:bg-cream hover:text-charcoal">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </PageHero>

      <section className="bg-background py-20">
        <div className="container-luxe grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="reveal space-y-5">
            {[
              { icon: Phone, t: "Phone", v: "+254 711 856 795", href: "tel:+254711856795" },
              { icon: Mail, t: "Email", v: "hello@honeyfield.co.ke", href: "mailto:hello@honeyfield.co.ke" },
              { icon: MapPin, t: "Address", v: "Nairobi, Kenya" },
              { icon: Clock, t: "Business Hours", v: "Mon – Sat · 8:00 – 18:00 EAT" },
            ].map((c) => (
              <a key={c.t} href={c.href} className="flex items-start gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-honey/20 text-honey-deep"><c.icon className="h-5 w-5" /></span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{c.t}</div>
                  <div className="font-display mt-1 text-xl text-charcoal">{c.v}</div>
                </div>
              </a>
            ))}

            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <iframe
                title="Honeyfield location"
                src="https://www.google.com/maps?q=Nairobi,Kenya&output=embed"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
                  <h3 className="font-display mt-5 text-2xl text-charcoal">Message received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We'll respond shortly. Asante!</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl text-charcoal">Send a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">We typically respond within a few hours during business days.</p>
                <div className="mt-6 grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full name" name="name" />
                    <Input label="Phone" name="phone" type="tel" />
                  </div>
                  <Input label="Email" name="email" type="email" />
                  <Input label="Subject" name="subject" />
                  <label className="text-sm font-medium text-charcoal">
                    Message
                    <textarea required rows={5} className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30" />
                  </label>
                  <button type="submit" className="btn-honey w-full">Send message</button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Input({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="text-sm font-medium text-charcoal">
      {label}
      <input required name={name} type={type} className="mt-1.5 w-full rounded-full border border-input bg-background px-5 py-3 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30" />
    </label>
  );
}
