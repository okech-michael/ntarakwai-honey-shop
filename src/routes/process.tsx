import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead, ParallaxBand } from "@/components/site/Story";
import { ArrowRight, ShoppingBag } from "lucide-react";
import apiary from "@/assets/apiary-kulal.jpg";
import production from "@/assets/gallery-production.jpg";
import honeycomb from "@/assets/honeycomb.jpg";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process: Hive Inspection to Delivery | Ntarakwai Beekeeping" },
      {
        name: "description",
        content:
          "Every stage of Ntarakwai honey: hive inspection, colony health, harvesting, processing and packaging at Gatab, quality control and nationwide delivery.",
      },
      { property: "og:title", content: "Our Process: Ntarakwai Beekeeping" },
      {
        property: "og:description",
        content: "From hive inspection on Mt. Kulal to a sealed jar at your door.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: production },
      { name: "twitter:image", content: production },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
  component: Process,
});

const STAGES = [
  {
    n: "01",
    t: "Hive inspection",
    b: "Field teams work through both apiaries, checking colony strength, brood pattern, stores and signs of disease. A colony that is not thriving is supported, not harvested.",
  },
  {
    n: "02",
    t: "Waiting for the season",
    b: "Harvest timing follows the mountain, not a calendar. We wait until combs are capped and the colony holds enough reserves to carry itself through what comes next.",
  },
  {
    n: "03",
    t: "Harvesting the surplus",
    b: "Only surplus comb is taken, using techniques that leave the colony, comb structure and surrounding trees intact. Our own harvest is joined by honey bought from over thirty local gatherers.",
  },
  {
    n: "04",
    t: "Straining and settling",
    b: "At our honey shop in Gatab, comb is strained and left to settle. No pasteurising, no forced heat, the enzymes, pollen traces and aroma of Mt. Kulal stay in the jar.",
  },
  {
    n: "05",
    t: "Beeswax recovery",
    b: "Wax from the harvest is cleaned and rendered into blocks rather than thrown away, becoming a product in its own right.",
  },
  {
    n: "06",
    t: "Quality control",
    b: "Our Processing & Quality Control Officer checks each batch against packaging standards and food-safety requirements before anything is sealed.",
  },
  {
    n: "07",
    t: "Packing and labelling",
    b: "Jars are filled, sealed and labelled in-house so the honey that leaves Gatab is traceable to the harvest it came from.",
  },
  {
    n: "08",
    t: "Delivery",
    b: "Orders are dispatched from Marsabit County by courier and delivered to customers and stockists across Kenya.",
  },
];

function Process() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Our Process"
        image={apiary}
        title={
          <>
            Eight stages, and not one of them <em className="text-honey">hurried</em>.
          </>
        }
        subtitle="From a hive inspection high on Mt. Kulal to a sealed jar arriving at your door."
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe">
          <ol className="relative mx-auto max-w-4xl">
            <span className="absolute left-[27px] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-honey via-honey-deep/50 to-transparent md:block" />
            {STAGES.map((s, i) => (
              <li
                key={s.n}
                className="reveal-slow relative mb-12 md:pl-24"
                style={{ transitionDelay: `${(i % 4) * 90}ms` }}
              >
                <span className="font-display absolute left-0 top-0 hidden h-14 w-14 place-items-center rounded-full border border-honey/50 bg-card text-lg text-honey-deep shadow-sm md:grid">
                  {s.n}
                </span>
                <div className="font-display text-sm text-honey-deep md:hidden">{s.n}</div>
                <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
                  {s.t}
                </h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ParallaxBand image={production} alt="" speed={0.18} className="py-24 md:py-32">
        <SectionHead
          tone="light"
          eyebrow="Standards"
          title={
            <>
              What “raw” means <em className="text-honey">here</em>.
            </>
          }
          intro="Raw is a word that gets used loosely. These are the specific commitments behind ours."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "No pasteurisation",
              b: "Heat is not used to force clarity or delay crystallisation. Granulation is allowed to happen naturally.",
            },
            {
              t: "No additives",
              b: "Nothing is blended in: no sugar syrup, no thinners, no flavouring. Honey and nothing else.",
            },
            {
              t: "Batch integrity",
              b: "Seasons taste different and we let them. Each batch reflects what Mt. Kulal was flowering at the time.",
            },
          ].map((c, i) => (
            <div
              key={c.t}
              className="reveal-slow rounded-3xl border border-cream/15 bg-charcoal/55 p-8 backdrop-blur"
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <h3 className="font-display text-2xl text-cream">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{c.b}</p>
            </div>
          ))}
        </div>
      </ParallaxBand>

      <section className="relative overflow-hidden bg-secondary/50 py-24">
        <div className="container-luxe flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
              You have seen how it is made. Now taste the difference.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Raw honey, beeswax and gift sets, delivered anywhere in Kenya.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey">
              <ShoppingBag className="h-4 w-4" /> Shop Now
            </Link>
            <Link to="/products" className="btn-outline-honey">
              See the range <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <img
          src={honeycomb}
          alt=""
          className="pointer-events-none absolute -right-20 -top-24 hidden h-72 w-72 rounded-full object-cover opacity-15 lg:block"
          loading="lazy"
        />
      </section>
    </>
  );
}
