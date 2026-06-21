import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SHOP_PRODUCTS, type ShopProduct } from "./products";

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  resolved: Array<{ product: ShopProduct; qty: number; lineTotal: number }>;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "honeyfield_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) {
        return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const resolved = useMemo(
    () =>
      items
        .map((i) => {
          const product = SHOP_PRODUCTS.find((p) => p.id === i.productId);
          if (!product) return null;
          return { product, qty: i.qty, lineTotal: product.price * i.qty };
        })
        .filter((x): x is { product: ShopProduct; qty: number; lineTotal: number } => x !== null),
    [items],
  );

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => resolved.reduce((s, r) => s + r.lineTotal, 0), [resolved]);

  const value: CartCtx = { items, count, subtotal, add, setQty, remove, clear, resolved };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe SSR / pre-mount fallback
    return {
      items: [],
      count: 0,
      subtotal: 0,
      add: () => {},
      setQty: () => {},
      remove: () => {},
      clear: () => {},
      resolved: [],
    };
  }
  return ctx;
}
