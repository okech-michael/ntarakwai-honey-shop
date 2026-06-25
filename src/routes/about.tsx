import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { Phone, Target, Eye, Sprout, BadgeCheck, Leaf } from "lucide-react";
import beekeeper from "@/assets/beekeeper.jpg";
import honeycomb from "@/assets/honeycomb.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ntarakuwai Pure & Natural Honey — Beekeeping with purpose" },
      { name: "description", content: "Our story, mission, beekeeping process and commitment to ethical, sustainable honey production in Kenya." },
      { property: "og:title", content: "About Ntarakuwai Pure & Natural Honey" },
      { property: "og:description", content: "Beekeeping with purpose — pure honey, ethical practice." },
      { property: "og:image", content: beekeeper },
    ],
  }),
  component: About,
});

const TIMELINE = [
  { year: "2012", title: "The first hive", body: "A single hive in the highlands sparked a family devotion to natural beekeeping." },
  { year: "2016", title: "Co-op formed", body: "Partnered with smallholder farmers to formalise ethical harvesting." },
  { year: "2020", title: "Lab-grade testing", body: "Introduced batch testing and full traceability across every jar." },
  { year: "Today", title: "National supply", body: "Trusted by hotels, supermarkets and wellness brands across Kenya." },
];

function About() {
  useReveal();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        image={beekeeper}
        title={<>A devotion to <em className="text-honey">pure, honest</em> honey.</>}
        subtitle="Twelve years of patient craft, ethical beekeeping and quality assurance — bottled in every drop."
      >
        <a href="tel:+254711856795" className="btn-honey"><Phone className="h-4 w-4" /> Call +254 711 856 795</a>
      </PageHero>

      <section className="bg-background py-24">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: "Our Mission", body: "To deliver the purest honey and bee products while uplifting Kenyan beekeepers and protecting pollinators." },
            { icon: Eye, title: "Our Vision", body: "To become East Africa's most trusted premium honey brand — synonymous with quality, ethics and craft." },
          ].map((b) => (
            <div key={b.title} className="reveal rounded-3xl border border-border bg-card p-10 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-honey/20 text-honey-deep">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-6 text-3xl text-charcoal">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 py-24">
        <div className="container-luxe">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Our journey</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">From one hive to a national brand</h2>
          </div>
          <ol className="relative mx-auto mt-14 max-w-3xl">
            <span className="absolute left-3 top-2 hidden h-[calc(100%-1rem)] w-px bg-honey/40 md:block md:left-1/2" />
            {TIMELINE.map((t, i) => (
              <li key={t.year} className={`reveal relative mb-10 grid gap-6 md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="md:text-right">
                  <div className="font-display text-3xl text-honey-deep">{t.year}</div>
                  <h3 className="font-display mt-1 text-2xl text-charcoal">{t.title}</h3>
                </div>
                <p className="text-muted-foreground md:pt-2">{t.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container-luxe grid items-center gap-14 md:grid-cols-2">
          <div className="reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Beekeeping process</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Slow craft, faithful to the bees</h2>
            <ul className="mt-8 space-y-5">
              {[
                { icon: Sprout, t: "Hive placement", d: "Hives are sited in pristine forests and flowering meadows." },
                { icon: Leaf, t: "Patient harvest", d: "We harvest only the surplus, never depleting a colony." },
                { icon: BadgeCheck, t: "Cold extraction", d: "Honey is cold-extracted to preserve enzymes and aroma." },
              ].map((s) => (
                <li key={s.t} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-honey/20 text-honey-deep"><s.icon className="h-4 w-4" /></span>
                  <div>
                    <div className="font-display text-lg text-charcoal">{s.t}</div>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <img src={honeycomb} alt="Macro honeycomb" className="reveal rounded-[2rem] shadow-[var(--shadow-card)]" loading="lazy" width={1280} height={896} />
        </div>
      </section>

      <section className="bg-charcoal py-20 text-cream">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="font-display max-w-2xl text-3xl md:text-4xl">Visit our apiary or speak with our team today.</h2>
          <Link to="/contact" className="btn-honey">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
