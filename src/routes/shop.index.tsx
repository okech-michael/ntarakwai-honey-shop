import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { PageHero } from "@/components/site/PageHero";
import { ShoppingBag, ShieldCheck, Truck, Leaf, ArrowRight, Star } from "lucide-react";
import { SHOP_PRODUCTS, SHOP_CATEGORIES, formatKES } from "@/lib/products";
import { useCart } from "@/lib/cart";
import hero from "@/assets/hero-honey.jpg";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop Premium Natural Honey Online — Honeyfield" },
      { name: "description", content: "Order pure honey, beeswax, propolis, bee pollen and honey gift packs online. Delivery anywhere in Kenya via Wells Fargo Courier." },
      { property: "og:title", content: "Shop Premium Natural Honey Online" },
      { property: "og:description", content: "Pure honey harvested naturally and delivered directly to your doorstep anywhere in Kenya." },
      { property: "og:image", content: hero },
    ],
  }),
  component: ShopHome,
});

function ShopHome() {
  useReveal();
  const { add } = useCart();
  const featured = SHOP_PRODUCTS.slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Shop Online"
        image={hero}
        title={<>Shop Premium <em className="text-honey">Natural Honey</em> Online</>}
        subtitle="Pure honey harvested naturally and delivered directly to your doorstep anywhere in Kenya."
      >
        <Link to="/shop/products" className="btn-honey"><ShoppingBag className="h-4 w-4" /> Shop Now</Link>
        <Link to="/shop/products" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-[0.95rem] text-sm font-semibold text-cream hover:bg-cream hover:text-charcoal">
          Explore Products <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      {/* Trust strip */}
      <section className="border-b border-border bg-background py-8">
        <div className="container-luxe grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Leaf, t: "100% Natural", s: "No additives, ever" },
            { icon: ShieldCheck, t: "Secure Checkout", s: "M-Pesa & Bank pay" },
            { icon: Truck, t: "Nationwide Delivery", s: "Wells Fargo Courier" },
            { icon: Star, t: "Loved in Kenya", s: "5-star reviews" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-honey/20 text-honey-deep"><f.icon className="h-5 w-5" /></span>
              <div>
                <div className="text-sm font-semibold text-charcoal">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/50 py-20">
        <div className="container-luxe">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Shop by category</span>
            <h2 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">Pure honey & hive treasures</h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {SHOP_CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/shop/products"
                search={{ category: c }}
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:border-honey-deep hover:text-honey-deep"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-background py-24">
        <div className="container-luxe">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Featured</span>
              <h2 className="font-display mt-2 text-4xl text-charcoal md:text-5xl">Our most-loved jars</h2>
            </div>
            <Link to="/shop/products" className="inline-flex items-center gap-2 text-sm font-semibold text-honey-deep hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <article
                key={p.id}
                className="reveal group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Link to="/shop/product/$slug" params={{ slug: p.slug }} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    {p.badge && <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-honey-dark">{p.badge}</span>}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{p.category} · {p.weight}</div>
                  <Link to="/shop/product/$slug" params={{ slug: p.slug }} className="font-display mt-1 block text-xl text-charcoal hover:text-honey-deep">{p.name}</Link>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg text-honey-deep">{formatKES(p.price)}</div>
                      {p.oldPrice && <div className="text-xs text-muted-foreground line-through">{formatKES(p.oldPrice)}</div>}
                    </div>
                    <button
                      onClick={() => add(p.id)}
                      aria-label={`Add ${p.name} to cart`}
                      className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-honey to-honey-deep text-charcoal shadow-md transition-transform hover:scale-110"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery banner */}
      <section className="bg-charcoal py-16 text-cream">
        <div className="container-luxe flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-honey text-charcoal"><Truck className="h-6 w-6" /></span>
            <div>
              <h3 className="font-display text-2xl md:text-3xl">Nationwide delivery via Wells Fargo Courier</h3>
              <p className="mt-1 text-sm text-cream/70">Order today, dispatched within 24 hours. Delivery to all 47 counties.</p>
            </div>
          </div>
          <Link to="/shop/products" className="btn-honey">Start shopping <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
