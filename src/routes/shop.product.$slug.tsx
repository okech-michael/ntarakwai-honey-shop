import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, ArrowLeft, Star } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { findProduct, SHOP_PRODUCTS, formatKES } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/shop/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Honeyfield Shop` },
          { name: "description", content: loaderData.product.shortDesc },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.shortDesc },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="font-display text-4xl text-charcoal">Product not found</h1>
      <Link to="/shop/products" className="btn-honey mt-6 inline-flex">Back to shop</Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  useReveal();
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = SHOP_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  function handleAdd() {
    add(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="bg-background pt-28 pb-20">
      <div className="container-luxe">
        <Link to="/shop/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-honey-deep">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="reveal">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-beige shadow-[var(--shadow-card)]">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <div key={i} className={`aspect-square overflow-hidden rounded-2xl border-2 ${i === 0 ? "border-honey-deep" : "border-border"} bg-beige`}>
                  <img src={src} alt="" className="h-full w-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="reveal">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-honey-deep">
              <span>{product.category}</span>
              {product.badge && <><span className="text-muted-foreground/40">·</span><span className="rounded-full bg-honey/20 px-2 py-0.5 text-honey-dark">{product.badge}</span></>}
            </div>
            <h1 className="font-display mt-3 text-4xl text-charcoal md:text-5xl">{product.name}</h1>

            <div className="mt-3 flex items-center gap-2 text-honey">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              <span className="text-xs text-muted-foreground">(124 reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-honey-deep">{formatKES(product.price)}</span>
              {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatKES(product.oldPrice)}</span>}
              <span className="text-xs text-muted-foreground">/ {product.weight}</span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.benefits.map((b: string) => (
                <li key={b} className="flex items-center gap-2 text-sm text-charcoal">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-honey text-charcoal"><Check className="h-3 w-3" /></span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Quantity + CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={handleAdd} className="btn-honey flex-1 sm:flex-none">
                {added ? <><Check className="h-4 w-4" /> Added to cart</> : <><ShoppingBag className="h-4 w-4" /> Add to cart</>}
              </button>
              <Link to="/shop/cart" className="btn-outline-honey flex-1 sm:flex-none" onClick={() => add(product.id, qty)}>
                Buy Now
              </Link>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {product.stock > 20 ? <span className="text-honey-deep font-medium">✓ In stock</span> : <span className="text-destructive font-medium">Only {product.stock} left</span>}
            </div>

            <div className="mt-8 grid gap-3 rounded-3xl border border-border bg-card p-5 text-sm">
              <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-honey-deep" /><span>Delivery via <strong>Wells Fargo Courier</strong> — 1–3 business days</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-honey-deep" /><span>Lab-tested, traceable & 100% pure</span></div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl text-charcoal md:text-4xl">You may also love</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <Link key={p.id} to="/shop/product/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-luxe)]">
                  <div className="aspect-[4/5] overflow-hidden bg-beige">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <div className="font-display text-lg text-charcoal">{p.name}</div>
                    <div className="mt-1 text-sm text-honey-deep">{formatKES(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
