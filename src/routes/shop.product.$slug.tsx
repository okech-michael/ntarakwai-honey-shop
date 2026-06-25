import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, ArrowLeft, Star, Send } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { findProduct, SHOP_PRODUCTS, formatKES, type ShopProduct } from "@/lib/products";
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
          { title: `${loaderData.product.name} — Ntarakuwai Pure & Natural Honey Shop` },
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
  const [activeProduct, setActiveProduct] = useState<ShopProduct>(product);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isActive = true;
    fetch(`/api/products/${product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isActive || !data?.product) return;
        setActiveProduct(data.product as ShopProduct);
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [product.slug]);

  const reviews = activeProduct.reviews ?? [];
  const reviewCount = reviews.length;
  const averageRating = useMemo(() => {
    if (!reviewCount) return 5;
    return Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1));
  }, [reviews, reviewCount]);
  const related = SHOP_PRODUCTS.filter((p) => p.id !== activeProduct.id && p.category === activeProduct.category).slice(0, 4);

  function handleAdd() {
    add(activeProduct.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleReviewSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    const response = await fetch(`/api/products/${activeProduct.slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reviewName,
        title: reviewTitle,
        comment: reviewComment,
        rating: reviewRating,
      }),
    });

    const data = await response.json();
    setSubmittingReview(false);

    if (!response.ok || !data?.product) {
      setReviewError(data?.error ?? "We could not save your review right now.");
      return;
    }

    setActiveProduct(data.product as ShopProduct);
    setReviewName("");
    setReviewTitle("");
    setReviewComment("");
    setReviewRating(5);
    setReviewSuccess("Thanks for sharing your feedback.");
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
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className={`h-4 w-4 ${k < Math.round(averageRating) ? "fill-current" : "opacity-40"}`} />)}
              <span className="text-xs text-muted-foreground">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-4xl text-honey-deep">{formatKES(activeProduct.price)}</span>
              {activeProduct.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatKES(activeProduct.oldPrice)}</span>}
              <span className="text-xs text-muted-foreground">/ {activeProduct.weight}</span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{activeProduct.description}</p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {activeProduct.benefits.map((b: string) => (
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
                <button onClick={() => setQty((q) => Math.min(activeProduct.stock, q + 1))} aria-label="Increase" className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={handleAdd} disabled={activeProduct.stock <= 0} className="btn-honey flex-1 sm:flex-none disabled:cursor-not-allowed disabled:opacity-60">
                {added ? <><Check className="h-4 w-4" /> Added to cart</> : <><ShoppingBag className="h-4 w-4" /> Add to cart</>}
              </button>
              <Link to="/shop/cart" className="btn-outline-honey flex-1 sm:flex-none" onClick={() => add(activeProduct.id, qty)}>
                Buy Now
              </Link>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              {activeProduct.stock > 20 ? <span className="text-honey-deep font-medium">✓ In stock</span> : activeProduct.stock > 0 ? <span className="text-destructive font-medium">Only {activeProduct.stock} left</span> : <span className="text-destructive font-medium">Out of stock</span>}
            </div>

            <div className="mt-8 grid gap-3 rounded-3xl border border-border bg-card p-5 text-sm">
              <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-honey-deep" /><span>Delivery via <strong>Via Wells Fargo or your preferred parcel courier</strong> — 1–3 business days</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-honey-deep" /><span>Lab-tested, traceable & 100% pure</span></div>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-border bg-card p-7 shadow-sm md:p-9">
          <h2 className="font-display text-3xl text-charcoal">Customer reviews</h2>
          <p className="mt-2 text-sm text-muted-foreground">Share what you loved about this product.</p>

          <form onSubmit={handleReviewSubmit} className="mt-7 grid gap-4 md:grid-cols-2">
            <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} required placeholder="Your name" className="rounded-full border border-input bg-background px-4 py-3 text-sm" />
            <input value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} required placeholder="Short title" className="rounded-full border border-input bg-background px-4 py-3 text-sm" />
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required rows={4} placeholder="Tell us about your experience" className="md:col-span-2 rounded-2xl border border-input bg-background px-4 py-3 text-sm" />
            <div className="flex items-center gap-3 md:col-span-2">
              <span className="text-sm text-muted-foreground">Rating</span>
              <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))} className="rounded-full border border-input bg-background px-3 py-2 text-sm">
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
              </select>
              <button type="submit" disabled={submittingReview} className="ml-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
                {submittingReview ? "Saving..." : <><Send className="h-4 w-4" /> Submit review</>}
              </button>
            </div>
            {reviewError && <p className="md:col-span-2 text-sm text-destructive">{reviewError}</p>}
            {reviewSuccess && <p className="md:col-span-2 text-sm text-honey-deep">{reviewSuccess}</p>}
          </form>

          <div className="mt-8 space-y-4">
            {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share yours.</p>}
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-charcoal">{review.title}</div>
                    <div className="text-sm text-muted-foreground">{review.name}</div>
                  </div>
                  <div className="flex items-center gap-1 text-honey">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : "opacity-40"}`} />)}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
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
