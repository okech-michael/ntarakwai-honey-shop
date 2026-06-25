import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { X } from "lucide-react";
import hives from "@/assets/gallery-hives.jpg";
import production from "@/assets/gallery-production.jpg";
import bees from "@/assets/gallery-bees.jpg";
import beekeeper from "@/assets/beekeeper.jpg";
import honeycomb from "@/assets/honeycomb.jpg";
import pPure from "@/assets/product-pure-honey.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pGift from "@/assets/product-gift.jpg";
import pPollen from "@/assets/product-pollen.jpg";

const IMAGES = [
  { src: hives, alt: "Wooden beehives in a wildflower meadow", span: "row-span-2" },
  { src: bees, alt: "Honeybees on honeycomb", span: "" },
  { src: production, alt: "Honey being poured into jars", span: "row-span-2" },
  { src: beekeeper, alt: "Beekeeper tending hives at golden hour", span: "" },
  { src: honeycomb, alt: "Honeycomb macro", span: "" },
  { src: pPure, alt: "Pure honey jar", span: "" },
  { src: pBeeswax, alt: "Beeswax blocks", span: "" },
  { src: pGift, alt: "Honey gift box", span: "row-span-2" },
  { src: pPollen, alt: "Bee pollen in wooden spoon", span: "" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — From hive to home" },
      { name: "description", content: "A visual journey through our beehives, harvesting process, production and packaging." },
      { property: "og:title", content: "Ntarakuwai Pure & Natural Honey Gallery" },
      { property: "og:description", content: "From hive to home — explore our craft." },
      { property: "og:image", content: hives },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  useReveal();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        image={hives}
        title={<>From hive to home — <em className="text-honey">our craft in motion</em>.</>}
        subtitle="A glimpse inside the beehives, harvests and quiet moments that shape every jar."
      />

      <section className="bg-background py-20">
        <div className="container-luxe">
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
            {IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setOpen(img.src)}
                className={`reveal group relative overflow-hidden rounded-2xl bg-beige ${img.span}`}
                style={{ transitionDelay: `${i * 40}ms` }}
                aria-label={`Open ${img.alt}`}
              >
                <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <span className="absolute inset-0 bg-charcoal/0 transition-colors group-hover:bg-charcoal/30" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-charcoal/85 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-cream text-charcoal" aria-label="Close" onClick={() => setOpen(null)}>
            <X className="h-5 w-5" />
          </button>
          <img src={open} alt="" className="max-h-[88vh] max-w-[95vw] rounded-2xl shadow-2xl animate-scale-in" />
        </div>
      )}
    </>
  );
}
