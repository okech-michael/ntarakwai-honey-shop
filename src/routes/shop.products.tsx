import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ShoppingBag, Search, SlidersHorizontal } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { SHOP_PRODUCTS, SHOP_CATEGORIES, formatKES, type ShopCategory } from "@/lib/products";
import { useCart } from "@/lib/cart";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "name"]).optional(),
});

export const Route = createFileRoute("/shop/products")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Products — Honeyfield Shop" },
      { name: "description", content: "Browse every honey and bee product available for online order: raw honey, organic, beeswax, propolis, pollen and gift sets." },
      { property: "og:title", content: "Shop All Honey Products" },
      { property: "og:description", content: "Pure honey and bee products available for nationwide delivery in Kenya." },
    ],
  }),
  component: ShopCatalog,
});

function ShopCatalog() {
  useReveal();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { add } = useCart();
  const [q, setQ] = useState(search.q ?? "");

  const category = (search.category as ShopCategory | undefined) ?? undefined;
  const sort = search.sort ?? "featured";

  const list = useMemo(() => {
    let out = SHOP_PRODUCTS.slice();
    if (category) out = out.filter((p) => p.category === category);
    if (q.trim()) {
      const term = q.toLowerCase();
      out = out.filter((p) => p.name.toLowerCase().includes(term) || p.shortDesc.toLowerCase().includes(term));
    }
    switch (sort) {
      case "price-asc": out.sort((a, b) => a.price - b.price); break;
      case "price-desc": out.sort((a, b) => b.price - a.price); break;
      case "name": out.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return out;
  }, [category, q, sort]);

  return (
    <div className="bg-background pt-28 pb-20">
      <div className="container-luxe">
        {/* Header */}
        <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Shop</span>
            <h1 className="font-display mt-2 text-4xl text-charcoal md:text-5xl">
              {category ? category : "All Products"}
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {list.length} {list.length === 1 ? "product" : "products"} · delivery anywhere in Kenya
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            <label className="relative flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search honey, propolis..."
                className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-honey-deep focus:ring-2 focus:ring-honey/30"
              />
            </label>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => navigate({ search: { ...search, sort: e.target.value as NonNullable<typeof sort> } })}
                className="appearance-none rounded-full border border-input bg-card py-3 pl-11 pr-8 text-sm outline-none focus:border-honey-deep"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="reveal mt-8 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: { ...search, category: undefined } })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${!category ? "bg-charcoal text-cream" : "border border-border bg-card text-foreground/70 hover:text-charcoal"}`}
          >
            All
          </button>
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate({ search: { ...search, category: c } })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${category === c ? "bg-charcoal text-cream" : "border border-border bg-card text-foreground/70 hover:text-charcoal"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {list.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-dashed border-border bg-card py-20 text-center">
            <p className="text-muted-foreground">No products match your search.</p>
            <button onClick={() => { setQ(""); navigate({ search: {} }); }} className="btn-outline-honey mt-6 text-sm">Reset filters</button>
          </div>
        ) : (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => (
              <article
                key={p.id}
                className="reveal group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)]"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <Link to="/shop/product/$slug" params={{ slug: p.slug }} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-beige">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    {p.badge && <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-honey-dark">{p.badge}</span>}
                    {p.stock < 20 && p.stock > 0 && (
                      <span className="absolute right-4 top-4 rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream">Low stock</span>
                    )}
                  </div>
                </Link>
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{p.category} · {p.weight}</div>
                  <Link to="/shop/product/$slug" params={{ slug: p.slug }} className="font-display mt-1 block text-xl text-charcoal hover:text-honey-deep">{p.name}</Link>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.shortDesc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg text-honey-deep">{formatKES(p.price)}</div>
                      {p.oldPrice && <div className="text-xs text-muted-foreground line-through">{formatKES(p.oldPrice)}</div>}
                    </div>
                    <button
                      onClick={() => add(p.id)}
                      aria-label={`Add ${p.name} to cart`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-honey to-honey-deep px-4 py-2 text-xs font-semibold text-charcoal shadow-md transition-transform hover:scale-105"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
