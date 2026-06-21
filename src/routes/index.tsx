import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Phone, ArrowRight, Leaf, ShieldCheck, Truck, Award, Star, Quote, ShoppingBag } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import hero from "@/assets/hero-honey.jpg";
import honeycomb from "@/assets/honeycomb.jpg";
import beekeeper from "@/assets/beekeeper.jpg";
import pPure from "@/assets/product-pure-honey.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pPollen from "@/assets/product-pollen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Honeyfield — Pure Natural Honey From Trusted Beekeepers" },
      { name: "description", content: "Premium honey, beeswax, propolis and bee pollen harvested naturally in Kenya. Wholesale & retail supply with quality assurance." },
      { property: "og:title", content: "Honeyfield — Pure Natural Honey" },
      { property: "og:description", content: "Premium honey and bee products from trusted Kenyan beekeepers." },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  useReveal();
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (heroRef.current) {
        const img = heroRef.current.querySelector<HTMLElement>("[data-hero-img]");
        const text = heroRef.current.querySelector<HTMLElement>("[data-hero-text]");
        if (img) img.style.transform = `scale(${1 + Math.min(y / 1400, 0.25)}) translateY(${y * 0.15}px)`;
        if (text) text.style.transform = `translateY(${y * 0.25}px)`;
        if (text) text.style.opacity = `${Math.max(0, 1 - y / 500)}`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <div className="absolute inset-0" data-hero-img>
          <img src={hero} alt="Golden honey dripping from a wooden dipper" className="h-full w-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/75" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="absolute block h-1.5 w-1.5 rounded-full bg-honey/70 blur-[1px]"
              style={{
                left: `${(i * 53) % 100}%`,
                bottom: `-20px`,
                animation: `drift ${8 + (i % 6)}s linear ${i * 0.6}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="container-luxe relative z-10 flex h-full flex-col items-start justify-end pb-20 pt-32 md:justify-center md:pb-0" data-hero-text>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-cream/30 bg-cream/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cream backdrop-blur">
            <Leaf className="h-3.5 w-3.5" /> Naturally Harvested in Kenya
          </span>
          <h1 className="font-display max-w-3xl text-5xl font-medium leading-[1.02] text-cream md:text-7xl">
            Pure Natural Honey<br />
            <span className="italic text-honey">From Trusted</span> Beekeepers
          </h1>
          <p className="mt-6 max-w-xl text-base text-cream/85 md:text-lg">
            Premium honey and bee products harvested naturally and delivered with uncompromising quality assurance.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey">
              <ShoppingBag className="h-4 w-4" /> Shop Now
            </Link>
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-charcoal">
              View Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-cream/15 bg-charcoal/45 backdrop-blur md:block">
          <div className="container-luxe grid grid-cols-2 gap-4 py-5 text-cream md:grid-cols-4">
            {[
              { icon: Leaf, label: "100% Natural Honey" },
              { icon: Award, label: "Trusted Quality" },
              { icon: ShieldCheck, label: "Wholesale & Retail" },
              { icon: Truck, label: "Fast Delivery" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm">
                <f.icon className="h-5 w-5 text-honey" />
                <span className="font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-background py-28">
        <div className="container-luxe grid items-center gap-14 md:grid-cols-2">
          <div className="reveal relative">
            <img src={beekeeper} alt="Beekeeper tending hives at golden hour" className="rounded-[2rem] shadow-[var(--shadow-card)]" loading="lazy" width={1280} height={896} />
            <div className="absolute -bottom-8 -right-4 hidden rounded-2xl bg-card p-5 shadow-xl md:block">
              <div className="text-3xl font-display text-honey-deep">12+</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Years of craft</div>
            </div>
          </div>
          <div className="reveal">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Our Story</span>
            <h2 className="font-display mt-4 text-4xl text-charcoal md:text-5xl">
              A family of beekeepers devoted to <em className="text-honey-deep">pure honey</em>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              For over a decade we have worked alongside small-scale farmers across the Kenyan highlands, championing ethical
              beekeeping and patient harvests. Every jar is traced, tested, and trusted — so you receive honey exactly as
              nature intended.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn-honey">Read our story <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/wholesale" className="btn-outline-honey">Wholesale enquiries</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-28">
        <div className="container-luxe">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Featured</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Bottled with care</h2>
            <p className="mt-4 text-muted-foreground">A curated selection of our finest bee-crafted products.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { img: pPure, title: "Pure Raw Honey", tag: "Bestseller" },
              { img: pBeeswax, title: "Natural Beeswax", tag: "Artisan" },
              { img: pPropolis, title: "Propolis Tincture", tag: "Wellness" },
              { img: pPollen, title: "Golden Bee Pollen", tag: "Superfood" },
            ].map((p, i) => (
              <Link
                key={p.title}
                to="/shop"
                className="reveal group block overflow-hidden rounded-3xl bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" width={896} height={1152} />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-honey-dark">{p.tag}</span>
                </div>
                <div className="flex items-center justify-between p-5">
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

      <section className="relative overflow-hidden bg-background py-28">
        <div className="hex-bg absolute inset-0 opacity-40" />
        <div className="container-luxe relative">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Why Honeyfield</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Quality you can taste</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "Pure Products", body: "Unadulterated honey, free from additives and preservatives." },
              { icon: ShieldCheck, title: "Ethical Beekeeping", body: "We harvest in harmony with the bees and their environment." },
              { icon: Award, title: "Quality Assurance", body: "Every batch is lab-tested and traceable to its hive." },
              { icon: Truck, title: "Reliable Supply", body: "Consistent bulk volumes for retailers, hotels and distributors." },
            ].map((f, i) => (
              <div key={f.title} className="reveal rounded-3xl border border-border bg-card p-7 shadow-sm transition-transform hover:-translate-y-1" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-honey/30 to-honey-deep/20 text-honey-deep">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display mt-5 text-xl text-charcoal">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 py-28">
        <div className="container-luxe">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Loved by partners</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Trusted across Kenya</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { q: "The most consistent honey supplier we have ever worked with. Quality has never wavered.", a: "Amina K.", r: "Hotel Procurement" },
              { q: "Beautiful packaging and an even more beautiful product. Our customers ask for it by name.", a: "James M.", r: "Supermarket Buyer" },
              { q: "Honeyfield's propolis and pollen lifted our wellness range to a premium tier.", a: "Wanjiru L.", r: "Wellness Retailer" },
            ].map((t, i) => (
              <figure key={i} className="reveal rounded-3xl bg-card p-8 shadow-sm" style={{ transitionDelay: `${i * 80}ms` }}>
                <Quote className="h-7 w-7 text-honey-deep/60" />
                <blockquote className="font-display mt-4 text-lg leading-relaxed text-charcoal">"{t.q}"</blockquote>
                <div className="mt-6 flex items-center gap-1 text-honey">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <figcaption className="mt-4 text-sm text-muted-foreground"><span className="font-semibold text-charcoal">{t.a}</span> · {t.r}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={honeycomb} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" width={1280} height={896} />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/75 to-charcoal/40" />
        <div className="container-luxe relative z-10 flex flex-col items-start gap-8 py-24 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl text-cream md:text-5xl">Ready to order premium honey?</h2>
            <p className="mt-4 text-cream/80">Order online for delivery anywhere in Kenya, or call our team for wholesale pricing.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="btn-honey text-base"><ShoppingBag className="h-5 w-5" /> Shop Now</Link>
            <a href="tel:+254711856795" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream hover:bg-cream hover:text-charcoal"><Phone className="h-4 w-4" /> +254 711 856 795</a>
          </div>
        </div>
      </section>
    </>
  );
}
