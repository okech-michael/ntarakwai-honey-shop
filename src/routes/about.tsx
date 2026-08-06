import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead, ParallaxBand, StatRow, Eyebrow } from "@/components/site/Story";
import { ArrowRight, Target, Eye, MapPin, ShoppingBag } from "lucide-react";
import { BRAND, FACTS, VALUES, AMBITIONS } from "@/lib/brand";
import beekeeper from "@/assets/beekeeper.jpg";
import mtKulal from "@/assets/mt-kulal.jpg";
import forest from "@/assets/kulal-forest.jpg";
import apiary from "@/assets/apiary-kulal.jpg";
import community from "@/assets/community-training.jpg";
import honeycomb from "@/assets/honeycomb.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ntarakwai — Conservation-Driven Beekeeping on Mt. Kulal" },
      { name: "description", content: "The story of Ntarakwai Beekeeping Limited: founder Ledany Timothy, Mt. Kulal in Marsabit County, our mission, vision, core values and where we are heading." },
      { property: "og:title", content: "About Ntarakwai Beekeeping Limited" },
      { property: "og:description", content: "A conservation-driven honey company born on Mt. Kulal, Loiyangalani Ward, Marsabit County." },
      { property: "og:type", content: "article" },
      { property: "og:image", content: mtKulal },
      { name: "twitter:image", content: mtKulal },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.legalName,
          founder: { "@type": "Person", name: BRAND.founder },
          foundingDate: "2026-06",
          email: BRAND.email,
          telephone: BRAND.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Gatab, Mt. Kulal",
            addressRegion: "Marsabit County",
            addressCountry: "KE",
          },
        }),
      },
    ],
  }),
  component: About,
});

function About() {
  useReveal();
  useParallax();

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        image={mtKulal}
        title={<>A company that began with a boy, a hive, and a <em className="text-honey">mountain</em>.</>}
        subtitle="Ntarakwai Beekeeping Limited produces raw honey and beeswax on Mt. Kulal while building a market for the community that harvests beside us."
      >
        <Link to="/shop" className="btn-honey"><ShoppingBag className="h-4 w-4" /> Shop the harvest</Link>
      </PageHero>

      {/* Founder journey */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div className="reveal-slow">
            <Eyebrow>The founder</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] text-charcoal md:text-5xl">
              {BRAND.founder} started keeping bees at <em className="text-honey-deep">fifteen</em>.
            </h2>
            <p className="dropcap mt-7 text-lg leading-relaxed text-muted-foreground">
              He grew up around Mt. Kulal, in a place where honey has always been part of life. What struck him
              early was the contradiction: the region produces exceptional honey — the biodiversity and untouched
              environment see to that — and yet the people harvesting it had nowhere consistent to sell.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              A trader might come. A price might be offered. Neither was reliable enough to build a household
              around. Good honey was routinely sold for less than it was worth, or not sold at all.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              So rather than starting another honey business, he set out to build something that solved several
              problems at once: produce authentic, high-quality honey; create a sustainable market for local
              beekeepers; promote environmental conservation; generate employment for local youth; protect Mt.
              Kulal's unique ecosystem; and build a nationally recognised premium honey brand out of all of it.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {BRAND.legalName} was registered as a limited company in {BRAND.registered}, and operates from its
              honey shop in {BRAND.shop}.
            </p>
          </div>

          <div className="reveal-slow space-y-6">
            <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-luxe)]">
              <img src={beekeeper} alt="Working a hive on the slopes of Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1280} height={896} />
            </div>
            <div className="rounded-[2rem] border border-border bg-card p-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-honey-deep" />
                <div>
                  <div className="font-display text-xl text-charcoal">Where we are</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{BRAND.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Two apiaries on the mountain, one honey shop in Gatab, and a network of gatherers across the
                    surrounding slopes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mt Kulal */}
      <ParallaxBand image={forest} alt="" speed={0.2} className="py-24 md:py-32" overlay="from-charcoal/90 via-charcoal/78 to-charcoal/92">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="reveal-slow">
            <Eyebrow tone="light">Mt. Kulal</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] text-cream md:text-5xl">
              The place is not a backdrop. It is the <em className="text-honey">ingredient</em>.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-cream/75">
              Mt. Kulal stands in northern Kenya's dry lands, catching cloud and holding a belt of indigenous
              forest that has no equivalent nearby. Its biodiversity and its distance from farmland are exactly
              why the honey is what it is.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-cream/75">
              Bees forage on wild, unsprayed vegetation. No monoculture flattens the flavour, and no agricultural
              chemistry follows it into the comb. Season by season, the honey carries whatever the mountain chose
              to flower.
            </p>
          </div>
          <div className="reveal-slow overflow-hidden rounded-[2.5rem]">
            <img src={apiary} alt="Hives sited on a rocky slope of Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1600} height={1104} />
          </div>
        </div>
        <div className="mt-16">
          <StatRow items={FACTS} />
        </div>
      </ParallaxBand>

      {/* Mission & Vision */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our Mission",
              body: "To empower local communities through sustainable honey production, conservation, eco-tourism and transparent business practices — while promoting inclusive economic growth across Marsabit County and Kenya.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              body: "To become East Africa's leading conservation-driven premium honey company, and to transform Mt. Kulal into a recognised centre for sustainable beekeeping, environmental conservation, eco-tourism and research.",
            },
          ].map((b, i) => (
            <div key={b.title} className="reveal-slow rounded-[2rem] border border-border bg-card p-10 shadow-sm md:p-12" style={{ transitionDelay: `${i * 120}ms` }}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-honey/35 to-honey-deep/20 text-honey-deep">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-7 text-3xl text-charcoal">{b.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container-luxe">
          <SectionHead
            eyebrow="Core values"
            title={<>Nine things we are not willing to <em className="text-honey-deep">trade away</em>.</>}
          />
          <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.title} className="reveal-slow bg-card p-8" style={{ transitionDelay: `${(i % 3) * 90}ms` }}>
                <div className="font-display text-xs uppercase tracking-[0.24em] text-honey-deep">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-3 text-2xl text-charcoal">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community teaser */}
      <section className="bg-background py-24 md:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="reveal-slow overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)]">
            <img src={community} alt="Local beekeepers in a training session near Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1600} height={1104} />
          </div>
          <div className="reveal-slow">
            <Eyebrow>The wider circle</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] text-charcoal md:text-5xl">
              We buy from more than thirty <em className="text-honey-deep">independent beekeepers</em>.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
              Our own 55 hives are only part of the story. Purchasing honey from local gatherers creates income
              for communities that previously lacked reliable markets, and our continuous training raises both
              the quality of their harvest and what it can earn.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/community" className="btn-honey">Community impact <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/team" className="btn-outline-honey">Meet the team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-charcoal py-24 text-cream md:py-32">
        <div className="container-luxe">
          <SectionHead
            tone="light"
            eyebrow="Where we are heading"
            title={<>A young company with a long <em className="text-honey">horizon</em>.</>}
            intro="These are the ambitions the company was built around — pursued at the pace the mountain, the bees and the community can carry."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AMBITIONS.map((a, i) => (
              <div
                key={a.title}
                className="reveal-slow rounded-3xl border border-cream/15 bg-cream/[0.04] p-8 transition-transform duration-700 hover:-translate-y-1.5"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="font-display text-3xl text-honey/70">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display mt-4 text-2xl">{a.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBand image={honeycomb} alt="" speed={0.12} overlay="from-charcoal/90 via-charcoal/78 to-charcoal/60">
        <div className="flex flex-col items-start gap-8 py-24 md:flex-row md:items-center md:justify-between">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-4xl leading-tight text-cream md:text-5xl">Come and see the mountain for yourself.</h2>
            <p className="mt-4 text-cream/75">Visit the honey shop in Gatab, or speak with our team about orders, wholesale and partnerships.</p>
          </div>
          <Link to="/contact" className="btn-honey">Get in touch <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </ParallaxBand>
    </>
  );
}
