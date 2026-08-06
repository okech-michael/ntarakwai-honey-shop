import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead, ParallaxBand, Eyebrow } from "@/components/site/Story";
import { ArrowRight, TreePine, Bug, Droplets, Recycle, Mountain, Telescope } from "lucide-react";
import forest from "@/assets/kulal-forest.jpg";
import mtKulal from "@/assets/mt-kulal.jpg";
import bees from "@/assets/gallery-bees.jpg";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Protecting Mt. Kulal's Forest & Bees | Ntarakwai" },
      { name: "description", content: "Conservation-driven beekeeping on Mt. Kulal: forest protection, pollinator health, surplus-only harvesting and a future in eco-tourism and research." },
      { property: "og:title", content: "Sustainability — Ntarakwai Beekeeping" },
      { property: "og:description", content: "Why conservation of Mt. Kulal's ecosystem is our production model, not our marketing." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: forest },
      { name: "twitter:image", content: forest },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sustainability" }],
  }),
  component: Sustainability,
});

function Sustainability() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        image={forest}
        title={<>Conservation is not our marketing. It is our <em className="text-honey">supply chain</em>.</>}
        subtitle="Bees only produce where the forest survives. On Mt. Kulal, protecting the ecosystem and producing honey are the same act."
      />

      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="reveal-slow">
            <Eyebrow>The ecosystem</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.07] text-charcoal md:text-5xl">
              An island of forest in an <em className="text-honey-deep">arid landscape</em>.
            </h2>
            <p className="dropcap mt-7 text-lg leading-relaxed text-muted-foreground">
              Mt. Kulal catches moisture that the surrounding lowlands never see, and holds a band of indigenous
              cloud forest because of it. That forest is the whole reason bees can work here — and it is
              vulnerable to the ordinary pressures of firewood, clearing and grazing that follow when local
              livelihoods run thin.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Beekeeping changes that arithmetic. It generates income that increases when the vegetation is
              intact and collapses when it is not. Conservation stops being a request and becomes the obvious
              economic choice.
            </p>
          </div>
          <div className="reveal-slow overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)]">
            <img src={mtKulal} alt="Cloud spilling over the forested ridge of Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1920} height={1088} />
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-luxe">
          <SectionHead
            eyebrow="Our practice"
            title={<>What we actually <em className="text-honey-deep">do differently</em>.</>}
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Droplets, t: "Surplus-only harvesting", b: "We take what a colony can spare and leave the reserves it needs to hold through the dry season." },
              { icon: Bug, t: "Colony health first", b: "Hives are inspected for colony strength and disease. A weak colony is left alone, not harvested harder." },
              { icon: TreePine, t: "Forest-positive siting", b: "Apiaries are placed to support pollination of indigenous vegetation rather than to maximise short-term yield." },
              { icon: Recycle, t: "Whole-hive use", b: "Beeswax is recovered and sold as its own product rather than discarded as a by-product of honey." },
              { icon: Mountain, t: "Community incentive", b: "Thirty-plus households earning from intact forest is stronger protection than any signpost." },
              { icon: Telescope, t: "Research ambitions", b: "Part of our vision is making Mt. Kulal a recognised centre for sustainable beekeeping research." },
            ].map((f, i) => (
              <div
                key={f.t}
                className="reveal-slow rounded-3xl border border-border bg-card p-8 shadow-sm transition-transform duration-700 hover:-translate-y-1.5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-honey/35 to-honey-deep/20 text-honey-deep">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-6 text-xl text-charcoal">{f.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand image={bees} alt="" speed={0.2} className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow tone="light">Pollinators</Eyebrow>
          <h2 className="font-display mt-4 text-4xl leading-[1.07] text-cream md:text-5xl reveal-slow">
            Every hive is a small act of <em className="text-honey">reforestation</em>.
          </h2>
          <p className="reveal-slow mt-6 text-lg leading-relaxed text-cream/75">
            Bees are not just producing honey on Mt. Kulal — they are pollinating the indigenous plants that hold
            the soil, feed the wildlife and keep the mountain's microclimate working. Growing the number of
            healthy colonies is one of the most direct contributions we can make to the landscape itself.
          </p>
        </div>
      </ParallaxBand>

      <section className="bg-background py-24">
        <div className="container-luxe reveal flex flex-col items-start justify-between gap-6 rounded-[2.5rem] bg-charcoal p-10 text-cream md:flex-row md:items-center md:p-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight md:text-4xl">Choosing this honey funds the forest that made it.</h2>
            <p className="mt-3 text-cream/70">
              There is no separating the two — which is exactly how we designed the company.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey">Shop the harvest</Link>
            <Link to="/community" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream hover:bg-cream hover:text-charcoal">
              Community impact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
