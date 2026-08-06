import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/Story";
import { Phone, ShoppingBag, ArrowRight, Check } from "lucide-react";
import pPure from "@/assets/product-pure-honey.jpg";
import pProcessed from "@/assets/product-processed.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pPollen from "@/assets/product-pollen.jpg";
import pGift from "@/assets/product-gift.jpg";
import honeycomb from "@/assets/honeycomb.jpg";
import { BRAND } from "@/lib/brand";

const STORIES = [
  {
    img: pPure,
    kicker: "The signature",
    title: "Raw Mt. Kulal Honey",
    story:
      "This is the jar the company was built around. Comb harvested from our apiaries and from gatherers across the mountain, strained and settled at Gatab — never pasteurised, never blended into uniformity. It granulates in the cold and loosens in warm water, exactly as raw honey should.",
    benefits: ["Unheated and unfiltered", "Natural enzymes and pollen traces", "Season-specific character"],
    pairing: "Straight from the spoon, over warm flatbread, or stirred into black tea once it has stopped steaming.",
  },
  {
    img: pProcessed,
    kicker: "For the kitchen line",
    title: "Clear Table Honey",
    story:
      "Lightly strained for a smooth, consistently pourable finish — built for hotels, cafés and kitchens that need the same behaviour from every bottle. Same origin, same mountain, tuned for volume service.",
    benefits: ["Consistent pour and texture", "Hospitality-friendly formats", "Long, stable shelf life"],
    pairing: "Breakfast service, baking, dressings and anywhere a kitchen needs honey to behave predictably.",
  },
  {
    img: pBeeswax,
    kicker: "Nothing wasted",
    title: "Natural Beeswax",
    story:
      "Wax is recovered from every harvest, cleaned and rendered into blocks rather than discarded. It carries the faint scent of the comb it came from — the same forage, in solid form.",
    benefits: ["Cosmetic and candle grade", "Clean, slow burn", "Recovered from our own harvest"],
    pairing: "Balms, salves, wood finishes, candles and the workbench of anyone who makes things by hand.",
  },
  {
    img: pPropolis,
    kicker: "The hive's defence",
    title: "Propolis",
    story:
      "Bees gather resin from trees and turn it into propolis to seal and defend the hive. On Mt. Kulal that resin comes from indigenous forest species, and it has long been valued in traditional use.",
    benefits: ["Concentrated hive resin", "Traditionally used for wellness", "Forest-sourced on Mt. Kulal"],
    pairing: "A drop at a time, taken as part of a daily wellness routine.",
  },
  {
    img: pPollen,
    kicker: "The forage, visible",
    title: "Bee Pollen",
    story:
      "Granules of the exact flowers the colony was working, collected and dried. Nothing tells the story of a season's forage more literally — the colour shifts with whatever Mt. Kulal was flowering.",
    benefits: ["Protein and micronutrient rich", "Sun-dried granules", "Changes with the season"],
    pairing: "Scattered over yoghurt, porridge or fruit — a spoonful, not a handful.",
  },
  {
    img: pGift,
    kicker: "A story worth giving",
    title: "Honey Gift Sets",
    story:
      "Presentation packs for corporate and personal gifting. The appeal is not only the honey — it is handing someone a mountain, a forest, and thirty households who now have a market.",
    benefits: ["Premium presentation", "Custom branding available", "Mixed honey and hive products"],
    pairing: "Client gifting, festive seasons, and anyone who already has enough things.",
  },
];

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Products — Raw Honey, Beeswax, Propolis & Pollen | Ntarakwai" },
      { name: "description", content: "Raw Mt. Kulal honey, clear table honey, natural beeswax, propolis, bee pollen and gift sets — the story, benefits and pairings behind each product." },
      { property: "og:title", content: "Ntarakwai Products — Raw honey and hive products from Mt. Kulal" },
      { property: "og:description", content: "The story behind every jar: origin, benefits and how to use it." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: pPure },
      { name: "twitter:image", content: pPure },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: Products,
});

function Products() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Our Products"
        image={honeycomb}
        title={<>Everything here came off one <em className="text-honey">mountain</em>.</>}
        subtitle="Raw honey and hive products from Mt. Kulal — each with its own season, character and use."
      >
        <Link to="/shop" className="btn-honey"><ShoppingBag className="h-4 w-4" /> Shop online</Link>
      </PageHero>

      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe">
          <SectionHead
            eyebrow="The range"
            title={<>Six products, one <em className="text-honey-deep">origin</em>.</>}
            intro="We keep the range narrow on purpose. Everything we sell comes out of the same hives, the same forest and the same bench in Gatab."
          />

          <div className="mt-20 space-y-24 md:space-y-32">
            {STORIES.map((p, i) => (
              <article key={p.title} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={`reveal-slow overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)] ${i % 2 ? "lg:order-2" : ""}`}>
                  <div className="aspect-[5/4] overflow-hidden bg-beige">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out hover:scale-105"
                      loading="lazy"
                      width={896}
                      height={1152}
                    />
                  </div>
                </div>

                <div className={`reveal-slow ${i % 2 ? "lg:order-1" : ""}`}>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-honey-deep">{p.kicker}</span>
                  <h3 className="font-display mt-4 text-4xl leading-[1.05] text-charcoal md:text-5xl">{p.title}</h3>
                  <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{p.story}</p>

                  <ul className="mt-7 space-y-2.5">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-charcoal/85">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-honey-deep" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 rounded-2xl border border-border bg-secondary/60 p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-honey-deep">How to enjoy it</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.pairing}</p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/shop/products" className="btn-honey text-sm"><ShoppingBag className="h-4 w-4" /> Buy online</Link>
                    <a href={BRAND.phoneHref} className="btn-outline-honey text-sm"><Phone className="h-4 w-4" /> Enquire</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">Custom volumes, private labels or wholesale?</h2>
            <p className="mt-3 text-muted-foreground">
              We supply retailers, hotels and distributors, and we are glad to talk through formats and branding.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-3">
            <Link to="/wholesale" className="btn-honey">Wholesale <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/process" className="btn-outline-honey">How it is made</Link>
          </div>
        </div>
      </section>
    </>
  );
}
