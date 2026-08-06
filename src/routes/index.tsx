import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Leaf, Mountain, Users, ShieldCheck, ShoppingBag, Sparkles, TreePine, HandHeart, Quote } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useParallax } from "@/hooks/use-parallax";
import { SectionHead, ParallaxBand, StatRow, Eyebrow } from "@/components/site/Story";
import { BRAND, FACTS, JOURNEY } from "@/lib/brand";
import hero from "@/assets/hero-honey.jpg";
import mtKulal from "@/assets/mt-kulal.jpg";
import forest from "@/assets/kulal-forest.jpg";
import apiary from "@/assets/apiary-kulal.jpg";
import community from "@/assets/community-training.jpg";
import honeycomb from "@/assets/honeycomb.jpg";
import pPure from "@/assets/product-pure-honey.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pGift from "@/assets/product-gift.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ntarakwai Beekeeping — Raw Honey from Mt. Kulal, Marsabit" },
      { name: "description", content: "Conservation-driven beekeeping on Mt. Kulal. Raw honey and beeswax from 55 hives and 30+ local gatherers in Loiyangalani Ward, Marsabit County, Kenya." },
      { property: "og:title", content: "Ntarakwai Beekeeping — Honey with a homeland" },
      { property: "og:description", content: "Raw honey and beeswax from the forests of Mt. Kulal, produced with the community that protects them." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  useReveal();
  useParallax();
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const el = heroRef.current;
      if (!el) return;
      const text = el.querySelector<HTMLElement>("[data-hero-text]");
      if (text) {
        text.style.transform = `translateY(${y * 0.22}px)`;
        text.style.opacity = `${Math.max(0, 1 - y / 620)}`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Chapter 1 · Emotion ─────────────────────────────── */}
      <section ref={heroRef} className="grain relative h-[100svh] min-h-[660px] w-full overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={hero}
            alt="Raw golden honey drawn from the comb"
            className="animate-ken-burns h-full w-full object-cover"
            width={1920}
            height={1280}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/45 via-charcoal/25 to-charcoal/85" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="absolute block h-1.5 w-1.5 rounded-full bg-honey/70 blur-[1px]"
              style={{ left: `${(i * 53) % 100}%`, bottom: "-20px", animation: `drift ${10 + (i % 7)}s linear ${i * 0.7}s infinite` }}
            />
          ))}
        </div>

        <div className="container-luxe relative z-10 flex h-full flex-col items-start justify-end pb-24 pt-32 md:justify-center md:pb-0" data-hero-text>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-cream backdrop-blur">
            <Mountain className="h-3.5 w-3.5" /> Mt. Kulal · Marsabit County
          </span>
          <h1 className="font-display max-w-4xl text-[3.1rem] font-medium leading-[0.98] text-cream md:text-8xl">
            Honey with a<br />
            <span className="italic text-honey">homeland</span>.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg">
            High on a mountain in northern Kenya, wild forest flowers become raw honey — harvested by the
            people who have always lived beside these bees, and who now have a market worthy of it.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey">
              <ShoppingBag className="h-4 w-4" /> Taste Mt. Kulal
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-charcoal"
            >
              Our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center md:flex">
          <span className="flex h-12 w-7 items-start justify-center rounded-full border border-cream/40 p-1.5">
            <span className="h-2 w-1 animate-float rounded-full bg-honey" />
          </span>
        </div>
      </section>

      {/* ── Chapter 2 · The Mountain ────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-28 md:py-36">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
          <div className="reveal-slow relative">
            <div className="overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)]">
              <img src={mtKulal} alt="Mist rolling over the forested ridge of Mt. Kulal at dawn" className="h-full w-full object-cover" loading="lazy" width={1920} height={1088} />
            </div>
            <div className="absolute -bottom-8 left-6 hidden rounded-3xl bg-card px-7 py-5 shadow-xl md:block">
              <div className="font-display text-3xl text-honey-deep">Mt. Kulal</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Loiyangalani Ward</div>
            </div>
          </div>
          <div className="reveal-slow">
            <Eyebrow>The mountain</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] text-charcoal md:text-6xl">
              A mountain that makes its own <em className="text-honey-deep">weather</em>.
            </h2>
            <p className="dropcap mt-7 text-lg leading-relaxed text-muted-foreground">
              Mt. Kulal rises out of the dry lands east of Lake Turkana, catching cloud where everything below is
              heat and stone. That single act of geography creates a pocket of biodiversity found nowhere else in
              the region — an untouched, unfarmed landscape of indigenous trees and seasonal blossom.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Bees here forage on a floral mix no one planted and no one sprays. It is the reason the honey tastes
              the way it does, and the reason we treat conservation as part of production rather than a slogan
              beside it.
            </p>
            <Link to="/sustainability" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-honey-deep hover:underline">
              How we protect the ecosystem <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Chapter 3 · The Journey ─────────────────────────── */}
      <ParallaxBand image={forest} alt="" speed={0.22} className="py-28 md:py-36" overlay="from-charcoal/90 via-charcoal/78 to-charcoal/92">
        <SectionHead
          tone="light"
          eyebrow="Forest to table"
          title={<>Six stages between a <em className="text-honey">blossom</em> and your table.</>}
          intro="Nothing in this journey is rushed. It cannot be — the mountain sets the pace, and the bees set the yield."
        />
        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {JOURNEY.map((j, i) => (
            <li
              key={j.step}
              className="reveal-slow rounded-3xl border border-cream/15 bg-charcoal/55 p-8 backdrop-blur transition-transform duration-700 hover:-translate-y-1.5"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-4xl text-honey/70">{j.step}</div>
              <h3 className="font-display mt-4 text-2xl text-cream">{j.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{j.body}</p>
            </li>
          ))}
        </ol>
        <div className="reveal mt-12 text-center">
          <Link to="/process" className="btn-honey">Walk the full process <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </ParallaxBand>

      {/* ── Chapter 4 · The Beekeepers ──────────────────────── */}
      <section className="bg-secondary/50 py-28 md:py-36">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div className="reveal-slow order-2 lg:order-1">
            <Eyebrow>The beekeepers</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] text-charcoal md:text-5xl">
              Thirty-plus harvests that used to have <em className="text-honey-deep">nowhere to go</em>.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
              Around Mt. Kulal, honey gathering is old knowledge. What was missing was a buyer — a consistent,
              fair, structured market. Families would harvest exceptional honey and then watch it sit.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Ntarakwai buys from more than thirty independent beekeepers, and trains them in harvesting
              techniques that raise both quality and the price their honey can command. Their harvest is not a
              supply line to us. It is the point.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/community" className="btn-honey">Community impact <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/team" className="btn-outline-honey">Meet the team</Link>
            </div>
          </div>
          <div className="reveal-slow order-1 overflow-hidden rounded-[2.5rem] shadow-[var(--shadow-luxe)] lg:order-2">
            <img src={community} alt="A beekeeping training session with local gatherers around Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1600} height={1104} />
          </div>
        </div>
      </section>

      {/* ── Chapter 5 · Why we're different ─────────────────── */}
      <section className="relative overflow-hidden bg-background py-28 md:py-36">
        <div className="hex-bg absolute inset-0 opacity-40" />
        <div className="container-luxe relative">
          <SectionHead
            eyebrow="Why Ntarakwai"
            title={<>Most honey has a brand. Ours has an <em className="text-honey-deep">address</em>.</>}
            intro="We were not built to be another jar on the shelf. Every part of this company exists to solve something the mountain needed solving."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Mountain, t: "Single-origin, singular place", b: "Every jar traces back to Mt. Kulal — one mountain, two apiaries, one honey shop in Gatab." },
              { icon: Leaf, t: "Wild forage, never farmed", b: "Bees feed on indigenous, unsprayed vegetation. No monoculture, no agricultural chemistry." },
              { icon: Users, t: "A market, not an extraction", b: "Buying from 30+ local gatherers turns a harvest into a livelihood instead of a surplus." },
              { icon: TreePine, t: "Conservation is the business model", b: "Bees need forest. Protecting Mt. Kulal's ecosystem is how we protect production." },
              { icon: ShieldCheck, t: "Raw, carefully handled", b: "Processing, packaging and food-safety standards overseen in-house at Gatab." },
              { icon: HandHeart, t: "Youth and women included", b: "Employment and training aimed squarely at the young people of Loiyangalani Ward." },
            ].map((f, i) => (
              <div
                key={f.t}
                className="reveal-slow rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
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

      {/* ── Chapter 6 · Trust ───────────────────────────────── */}
      <ParallaxBand image={apiary} alt="" speed={0.16} className="py-24 md:py-32" overlay="from-charcoal/92 via-charcoal/80 to-charcoal/92">
        <SectionHead
          tone="light"
          eyebrow="Where we stand today"
          title={<>A young company, counted <em className="text-honey">honestly</em>.</>}
          intro="Ntarakwai Beekeeping Limited was registered in June 2026 and operates from its honey shop in Gatab. These are the real numbers, and they are growing as more hives colonise."
        />
        <div className="mt-14">
          <StatRow items={FACTS} />
        </div>
      </ParallaxBand>

      {/* ── Chapter 7 · Customer experience ─────────────────── */}
      <section className="bg-background py-28 md:py-36">
        <div className="container-luxe">
          <SectionHead
            eyebrow="What arrives"
            title={<>Opening the jar is the <em className="text-honey-deep">last stage</em> of the journey.</>}
            intro="Raw honey behaves like a natural product, because it is one. Here is what to expect."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { n: "Crystals are a good sign", b: "Raw honey granulates over time. Stand the jar in warm water and it returns to liquid — pasteurised honey never does this." },
              { n: "The flavour shifts by season", b: "Each harvest reflects what was flowering. Colour and taste vary between batches, and we do not blend that away." },
              { n: "It travels well", b: "Sealed, packed and dispatched by courier from Marsabit County to customers across Kenya." },
            ].map((c, i) => (
              <div key={c.n} className="reveal-slow" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="h-px w-16 bg-honey-deep" />
                <h3 className="font-display mt-6 text-2xl text-charcoal">{c.n}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>

          <figure className="reveal-slow mx-auto mt-20 max-w-3xl text-center">
            <Quote className="mx-auto h-8 w-8 text-honey-deep/50" />
            <blockquote className="font-display mt-6 text-2xl leading-relaxed text-charcoal md:text-3xl">
              “I started keeping bees at fifteen. The honey here was always exceptional — what we lacked was
              somewhere for it to go.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-charcoal">{BRAND.founder}</span> · Founder &amp; Director
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Chapter 8 · Conservation ────────────────────────── */}
      <section className="bg-charcoal py-28 text-cream md:py-36">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <div className="reveal-slow overflow-hidden rounded-[2.5rem]">
            <img src={forest} alt="Indigenous cloud forest on the upper slopes of Mt. Kulal" className="h-full w-full object-cover" loading="lazy" width={1600} height={1104} />
          </div>
          <div className="reveal-slow">
            <Eyebrow tone="light">Conservation</Eyebrow>
            <h2 className="font-display mt-4 text-4xl leading-[1.06] md:text-5xl">
              You cannot keep bees on a <em className="text-honey">dying mountain</em>.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-cream/75">
              Every hive on Mt. Kulal is an argument for keeping the forest standing. Beekeeping gives the
              community an income that depends on intact vegetation rather than on clearing it — which makes
              conservation the rational choice, not the sacrificial one.
            </p>
            <ul className="mt-9 space-y-4">
              {[
                "Harvesting only surplus, so colonies stay strong through the dry season.",
                "Hives sited to support pollination of indigenous vegetation.",
                "Training gatherers in methods that do not damage trees or colonies.",
                "Working towards eco-tourism and research that value the mountain intact.",
              ].map((s) => (
                <li key={s} className="flex gap-3 text-cream/80">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-honey" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
            <Link to="/sustainability" className="btn-honey mt-10">Read our conservation work <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* ── Chapter 9 · Featured products ───────────────────── */}
      <section className="bg-secondary/50 py-28 md:py-36">
        <div className="container-luxe">
          <SectionHead
            eyebrow="From the shop in Gatab"
            title={<>Carry a piece of the <em className="text-honey-deep">mountain</em> home.</>}
            intro="Raw honey and beeswax, plus hive products and gifting — packed under our own quality control."
          />
          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { img: pPure, title: "Raw Mt. Kulal Honey", tag: "Signature" },
              { img: pBeeswax, title: "Natural Beeswax", tag: "Hive product" },
              { img: pPropolis, title: "Propolis", tag: "Wellness" },
              { img: pGift, title: "Honey Gift Sets", tag: "Gifting" },
            ].map((p, i) => (
              <Link
                key={p.title}
                to="/shop"
                className="reveal-slow group block overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" loading="lazy" width={896} height={1152} />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-honey-dark">{p.tag}</span>
                </div>
                <div className="flex items-center justify-between p-6">
                  <div>
                    <div className="font-display text-lg text-charcoal">{p.title}</div>
                    <div className="text-xs text-muted-foreground">Shop now</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-honey-deep transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ─────────────────────────────────────────── */}
      <ParallaxBand image={honeycomb} alt="" speed={0.12} overlay="from-charcoal/92 via-charcoal/80 to-charcoal/60">
        <div className="flex flex-col items-start gap-8 py-24 md:flex-row md:items-center md:justify-between md:py-28">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-4xl leading-tight text-cream md:text-5xl">
              Buy honey. Keep a forest standing.
            </h2>
            <p className="mt-5 text-cream/75">
              Every order supports gatherers around Mt. Kulal and the ecosystem their bees depend on.
              Delivered anywhere in Kenya.
            </p>
          </div>
          <div className="reveal flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey text-base"><ShoppingBag className="h-5 w-5" /> Shop Now</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream hover:bg-cream hover:text-charcoal">
              Talk to us
            </Link>
          </div>
        </div>
      </ParallaxBand>
    </>
  );
}
