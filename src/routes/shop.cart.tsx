import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useCart } from "@/lib/cart";
import { formatKES } from "@/lib/products";

export const Route = createFileRoute("/shop/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Honeyfield Shop" },
      { name: "description", content: "Review your honey order before checkout." },
    ],
  }),
  component: CartPage,
});

const DELIVERY_FLAT = 350; // KES flat estimate

function CartPage() {
  useReveal();
  const { resolved, subtotal, setQty, remove, count } = useCart();
  const delivery = subtotal > 0 ? DELIVERY_FLAT : 0;
  const total = subtotal + delivery;

  if (count === 0) {
    return (
      <div className="bg-background pt-32 pb-20">
        <div className="container-luxe">
          <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-honey/20 text-honey-deep">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h1 className="font-display mt-6 text-3xl text-charcoal">Your cart is empty</h1>
            <p className="mt-2 text-sm text-muted-foreground">Browse our collection and add a jar of pure honey.</p>
            <Link to="/shop/products" className="btn-honey mt-8 inline-flex">Start shopping <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background pt-28 pb-20">
      <div className="container-luxe">
        <div className="reveal">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-deep">Cart</span>
          <h1 className="font-display mt-2 text-4xl text-charcoal md:text-5xl">Your basket</h1>
          <p className="mt-2 text-sm text-muted-foreground">{count} {count === 1 ? "item" : "items"} ready to ship</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Line items */}
          <div className="reveal space-y-4">
            {resolved.map(({ product, qty, lineTotal }) => (
              <div key={product.id} className="grid grid-cols-[88px_1fr_auto] items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm sm:grid-cols-[120px_1fr_auto_auto]">
                <Link to="/shop/product/$slug" params={{ slug: product.slug }} className="overflow-hidden rounded-2xl bg-beige">
                  <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
                </Link>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{product.category} · {product.weight}</div>
                  <Link to="/shop/product/$slug" params={{ slug: product.slug }} className="font-display mt-0.5 block truncate text-lg text-charcoal hover:text-honey-deep">{product.name}</Link>
                  <div className="mt-1 text-sm text-honey-deep">{formatKES(product.price)}</div>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background p-1 sm:hidden">
                    <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="hidden items-center gap-1 rounded-full border border-border bg-background p-1 sm:inline-flex">
                  <button onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-9 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(product.id, qty + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-display text-lg text-charcoal">{formatKES(lineTotal)}</div>
                  <button onClick={() => remove(product.id)} aria-label="Remove" className="text-muted-foreground transition-colors hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link to="/shop/products" className="inline-flex items-center gap-2 text-sm font-semibold text-honey-deep hover:underline">
              ← Continue shopping
            </Link>
          </div>

          {/* Summary */}
          <aside className="reveal h-fit rounded-3xl border border-border bg-card p-7 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-display text-2xl text-charcoal">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium text-charcoal">{formatKES(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery (est.)</dt><dd className="font-medium text-charcoal">{formatKES(delivery)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd className="text-muted-foreground">Included</dd></div>
            </dl>
            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg text-charcoal">Total</span>
                <span className="font-display text-2xl text-honey-deep">{formatKES(total)}</span>
              </div>
            </div>

            <Link to="/shop/checkout" className="btn-honey mt-6 w-full text-sm">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-5 flex items-center gap-2 rounded-2xl bg-secondary/70 p-3 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-honey-deep" />
              <span>Delivery via Wells Fargo Courier — final cost calculated at checkout based on your county.</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
