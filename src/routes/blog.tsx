import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { ArrowRight } from "lucide-react";
import honeycomb from "@/assets/honeycomb.jpg";
import beekeeper from "@/assets/beekeeper.jpg";
import bees from "@/assets/gallery-bees.jpg";
import production from "@/assets/gallery-production.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pPollen from "@/assets/product-pollen.jpg";
import pGift from "@/assets/product-gift.jpg";

const POSTS = [
  { img: honeycomb, cat: "Health Benefits", title: "Seven proven benefits of raw honey", date: "May 14", read: "5 min read" },
  { img: beekeeper, cat: "Beekeeping Insights", title: "Inside a Kenyan apiary at golden hour", date: "Apr 28", read: "7 min read" },
  { img: pPropolis, cat: "Natural Wellness", title: "Propolis: nature's quiet immune ally", date: "Apr 12", read: "4 min read" },
  { img: pPollen, cat: "Natural Wellness", title: "Why bee pollen is the complete superfood", date: "Mar 30", read: "6 min read" },
  { img: production, cat: "Product Guides", title: "Raw vs processed honey — what to choose", date: "Mar 18", read: "5 min read" },
  { img: bees, cat: "Beekeeping Insights", title: "How a single hive supports an entire forest", date: "Feb 22", read: "8 min read" },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Honeyfield" },
      { name: "description", content: "Insights on the health benefits of honey, ethical beekeeping, natural wellness and product guides." },
      { property: "og:title", content: "Honeyfield Journal" },
      { property: "og:description", content: "Stories from the apiary and the wellness bench." },
      { property: "og:image", content: pGift },
    ],
  }),
  component: Blog,
});

function Blog() {
  useReveal();
  return (
    <>
      <PageHero
        eyebrow="Journal"
        image={beekeeper}
        title={<>Stories from the <em className="text-honey">apiary</em>.</>}
        subtitle="Insights on honey, beekeeping, wellness and craft — from our team and partners."
      />
      <section className="bg-background py-20">
        <div className="container-luxe">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((p, i) => (
              <article key={p.title} className="reveal group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-beige">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-honey-deep">
                    <span>{p.cat}</span><span className="text-muted-foreground/60">·</span><span className="text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="font-display mt-3 text-xl leading-snug text-charcoal">{p.title}</h3>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p.read}</span>
                    <span className="inline-flex items-center gap-1 text-honey-deep">Read <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
