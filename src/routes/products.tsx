import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { Phone, ShoppingBag, ArrowRight } from "lucide-react";
import pPure from "@/assets/product-pure-honey.jpg";
import pProcessed from "@/assets/product-processed.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pPollen from "@/assets/product-pollen.jpg";
import pGift from "@/assets/product-gift.jpg";
import honeycomb from "@/assets/honeycomb.jpg";

type Cat = "All" | "Honey" | "Hive Products" | "Gifting";

const PRODUCTS = [
  { img: pPure, title: "Pure Raw Honey", cat: "Honey" as Cat, desc: "Unprocessed, cold-extracted honey with full enzymatic richness.", benefits: ["Natural energy", "Immunity", "Rich flavour"] },
  { img: pProcessed, title: "Processed Clear Honey", cat: "Honey" as Cat, desc: "Lightly filtered for a smooth, pourable finish — ideal for hospitality.", benefits: ["Consistent texture", "Long shelf life"] },
  { img: pBeeswax, title: "Natural Beeswax", cat: "Hive Products" as Cat, desc: "Pure beeswax blocks for cosmetics, candles and artisans.", benefits: ["Cosmetic-grade", "Clean burn"] },
  { img: pPropolis, title: "Propolis Tincture", cat: "Hive Products" as Cat, desc: "Concentrated propolis extract for natural immune support.", benefits: ["Antioxidant", "Wellness tonic"] },
  { img: pPollen, title: "Golden Bee Pollen", cat: "Hive Products" as Cat, desc: "Sun-dried pollen granules — a complete superfood.", benefits: ["Protein-rich", "Vitamins & minerals"] },
  { img: pGift, title: "Honey Gift Packages", cat: "Gifting" as Cat, desc: "Elegantly packaged gift sets for corporate and personal gifting.", benefits: ["Premium packaging", "Custom branding"] },
];

const CATS: Cat[] = ["All", "Honey", "Hive Products", "Gifting"];

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Honey, Beeswax, Propolis & Pollen" },
      { name: "description", content: "Browse Ntarakuwai Pure & Natural Honey's premium catalogue: pure honey, processed honey, beeswax, propolis, bee pollen and gift packs." },
      { property: "og:title", content: "Ntarakuwai Pure & Natural Honey Products" },
      { property: "og:description", content: "Premium honey and bee product catalogue." },
      { property: "og:image", content: pPure },
    ],
  }),
  component: Products,
});

function Products() {
  useReveal();
  const [cat, setCat] = useState<Cat>("All");
  const list = useMemo(() => PRODUCTS.filter((p) => cat === "All" || p.cat === cat), [cat]);

  return (
    <>
      <PageHero
        eyebrow="Our Products"
        image={honeycomb}
        title={<>Bottled with care, <em className="text-honey">made by bees</em>.</>}
        subtitle="A curated catalogue of honey and hive products for retail, wholesale and gifting."
      />

      <section className="bg-background py-20">
        <div className="container-luxe">
          <div className="reveal flex flex-wrap items-center justify-center gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  cat === c ? "bg-charcoal text-cream" : "border border-border bg-card text-foreground/75 hover:text-charcoal"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <article
                key={p.title}
                className="reveal group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" width={896} height={1152} />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-honey-dark">{p.cat}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-charcoal">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.benefits.map((b) => (
                      <li key={b} className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-charcoal/80">{b}</li>
                    ))}
                  </ul>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-honey-dark">
                      <ShoppingBag className="h-3.5 w-3.5" /> Shop
                    </Link>
                    <a href="tel:+254711856795" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-secondary">
                      <Phone className="h-3.5 w-3.5" /> Enquire
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-20">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl text-charcoal md:text-4xl">Looking for custom volumes or labels?</h2>
            <p className="mt-2 text-muted-foreground">We supply retailers, hotels, supermarkets and distributors across the region.</p>
          </div>
          <a href="tel:+254711856795" className="btn-honey">Talk to sales <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </>
  );
}
