import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead, ParallaxBand, Eyebrow } from "@/components/site/Story";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Coins,
  HandHeart,
  Sprout,
  Handshake,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
import community from "@/assets/community-training.jpg";
import apiary from "@/assets/apiary-kulal.jpg";
import beekeeper from "@/assets/beekeeper.jpg";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community: Beekeeping as a Livelihood on Mt. Kulal | Ntarakwai" },
      {
        name: "description",
        content:
          "How Ntarakwai creates market access, training and youth employment for honey gatherers around Mt. Kulal in Marsabit County, Kenya.",
      },
      { property: "og:title", content: "Community: Ntarakwai Beekeeping" },
      {
        property: "og:description",
        content: "Market access, training and employment for the honey gatherers of Mt. Kulal.",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: community },
      { name: "twitter:image", content: community },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/community" }],
  }),
  component: Community,
});

const PILLARS = [
  {
    icon: Coins,
    t: "A reliable market",
    b: "We buy honey from more than thirty independent beekeepers around Mt. Kulal. Before Ntarakwai, most had no structured buyer and no predictable price.",
  },
  {
    icon: GraduationCap,
    t: "Training that pays",
    b: "We train gatherers in improved harvesting and handling techniques. Better technique means better honey, and better honey earns more.",
  },
  {
    icon: Users,
    t: "Youth employment",
    b: "Creating work for young people in Loiyangalani Ward is one of the founding reasons this company exists, not an afterthought.",
  },
  {
    icon: HandHeart,
    t: "Women in the value chain",
    b: "Harvesting, sorting, processing and packaging all create roles that women in the community hold and lead.",
  },
  {
    icon: Sprout,
    t: "Skills that stay",
    b: "Hive management, colony health and food-safety knowledge remain with the community whether or not a household sells to us.",
  },
  {
    icon: Handshake,
    t: "Transparent dealing",
    b: "Open about what we buy, from whom, and at what price. Transparency is one of our stated core values.",
  },
];

function Community() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Community"
        image={community}
        title={
          <>
            The honey is the product. The <em className="text-honey">livelihood</em> is the point.
          </>
        }
        subtitle="Ntarakwai exists because exceptional honey was being harvested on Mt. Kulal with nowhere reliable to sell it."
      >
        <Link to="/shop" className="btn-honey">
          Support the work <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="reveal-slow overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)]">
            <img
              src={beekeeper}
              alt="A beekeeper working a hive at golden hour"
              className="h-full w-full object-cover"
              loading="lazy"
              width={1280}
              height={896}
            />
          </div>
          <div className="reveal-slow">
            <Eyebrow>The problem we started with</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.07] text-charcoal md:text-5xl">
              Great harvests, no <em className="text-honey-deep">route to market</em>.
            </h2>
            <p className="dropcap mt-7 text-lg leading-relaxed text-muted-foreground">
              Around Mt. Kulal, honey gathering is generational knowledge. What was missing was
              everything after the harvest: a buyer who would turn up, a fair and predictable price,
              and standards worth reaching for. Honey sat in containers waiting for a passing
              trader.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {BRAND.founder} founded Ntarakwai to close that gap, to produce authentic honey of its
              own while creating a sustainable market for everyone else harvesting on the same
              mountain.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-luxe">
          <SectionHead
            eyebrow="How the impact works"
            title={
              <>
                Six ways a jar of honey reaches <em className="text-honey-deep">further</em>.
              </>
            }
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p, i) => (
              <div
                key={p.t}
                className="reveal-slow rounded-3xl border border-border bg-card p-8 shadow-sm transition-transform duration-700 hover:-translate-y-1.5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-honey/35 to-honey-deep/20 text-honey-deep">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-6 text-xl text-charcoal">{p.t}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand image={apiary} alt="" speed={0.18} className="py-24 md:py-32">
        <SectionHead
          tone="light"
          eyebrow="Training"
          title={
            <>
              Teaching the harvest, not just <em className="text-honey">buying</em> it.
            </>
          }
          intro="Continuous training with local honey gatherers is one of our permanent activities, improving technique, quality and, in turn, household income."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Harvesting technique",
              b: "Timing the harvest, taking only surplus, and avoiding damage to comb, colony or tree.",
            },
            {
              n: "02",
              t: "Handling & hygiene",
              b: "Keeping honey clean from comb to container, so quality survives the journey off the mountain.",
            },
            {
              n: "03",
              t: "Quality standards",
              b: "Understanding what a premium buyer looks for, and what that standard is worth in price.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className="reveal-slow rounded-3xl border border-cream/15 bg-charcoal/55 p-8 backdrop-blur"
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              <div className="font-display text-4xl text-honey/70">{s.n}</div>
              <h3 className="font-display mt-4 text-2xl text-cream">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{s.b}</p>
            </div>
          ))}
        </div>
      </ParallaxBand>

      <section className="bg-background py-24">
        <div className="container-luxe reveal flex flex-col items-start justify-between gap-6 rounded-[2.5rem] border border-border bg-card p-10 shadow-sm md:flex-row md:items-center md:p-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
              Harvesting honey around Mt. Kulal?
            </h2>
            <p className="mt-3 text-muted-foreground">
              We are always looking to work with more gatherers. Get in touch about supplying us, or
              joining a training session.
            </p>
          </div>
          <Link to="/contact" className="btn-honey">
            Talk to us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
