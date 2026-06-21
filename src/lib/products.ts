import pPure from "@/assets/product-pure-honey.jpg";
import pProcessed from "@/assets/product-processed.jpg";
import pBeeswax from "@/assets/product-beeswax.jpg";
import pPropolis from "@/assets/product-propolis.jpg";
import pPollen from "@/assets/product-pollen.jpg";
import pGift from "@/assets/product-gift.jpg";

export type ShopCategory =
  | "Raw Honey"
  | "Processed Honey"
  | "Beeswax"
  | "Propolis"
  | "Bee Pollen"
  | "Gift Packages";

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: ShopCategory;
  image: string;
  weight: string;
  price: number; // KES
  oldPrice?: number;
  stock: number;
  badge?: string;
  shortDesc: string;
  description: string;
  benefits: string[];
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "raw-500",
    slug: "pure-raw-honey-500g",
    name: "Pure Raw Honey",
    category: "Raw Honey",
    image: pPure,
    weight: "500g",
    price: 850,
    oldPrice: 950,
    stock: 42,
    badge: "Bestseller",
    shortDesc: "Cold-extracted, unprocessed honey with full enzymatic richness.",
    description:
      "Harvested by hand from highland apiaries and cold-extracted to preserve every enzyme, aroma and antioxidant. Unfiltered, unheated and unblended — pure honey, exactly as the bees made it.",
    benefits: ["Natural energy", "Immunity support", "Rich floral flavour", "Antioxidant-rich"],
  },
  {
    id: "raw-1kg",
    slug: "pure-raw-honey-1kg",
    name: "Pure Raw Honey — Family Jar",
    category: "Raw Honey",
    image: pPure,
    weight: "1kg",
    price: 1600,
    stock: 28,
    shortDesc: "The everyday family jar of our finest raw honey.",
    description:
      "Our most-loved jar in a generous one-kilogram size. Perfect for daily wellness, baking and shared family breakfasts.",
    benefits: ["Family size", "Best value", "Pure & raw"],
  },
  {
    id: "organic-500",
    slug: "organic-wildflower-honey",
    name: "Organic Wildflower Honey",
    category: "Raw Honey",
    image: pPure,
    weight: "500g",
    price: 1100,
    stock: 18,
    badge: "Organic",
    shortDesc: "Certified organic wildflower honey from protected forest hives.",
    description:
      "Bees forage freely across protected wildflower meadows far from any agriculture. The result is a complex, multi-floral honey with a deep amber colour and lingering finish.",
    benefits: ["Certified organic", "Multi-floral", "Forest-sourced"],
  },
  {
    id: "processed-500",
    slug: "processed-clear-honey-500g",
    name: "Processed Clear Honey",
    category: "Processed Honey",
    image: pProcessed,
    weight: "500g",
    price: 720,
    stock: 65,
    shortDesc: "Lightly filtered, smooth and pourable — ideal for hospitality.",
    description:
      "Gently warmed and finely filtered for a crystal-clear pour and silky texture. A consistent choice for cafés, hotels and busy kitchens that want premium quality without the crystallisation.",
    benefits: ["Smooth pour", "Long shelf life", "Hospitality-ready"],
  },
  {
    id: "beeswax-250",
    slug: "natural-beeswax-block",
    name: "Natural Beeswax Block",
    category: "Beeswax",
    image: pBeeswax,
    weight: "250g",
    price: 650,
    stock: 34,
    badge: "Artisan",
    shortDesc: "Pure cosmetic-grade beeswax for candles, balms and crafts.",
    description:
      "Filtered, sun-bleached beeswax in clean pour-ready blocks. Cosmetic and food grade — perfect for candle makers, soap makers and natural skincare formulators.",
    benefits: ["Cosmetic-grade", "Clean burn", "Natural fragrance"],
  },
  {
    id: "propolis-30",
    slug: "propolis-tincture-30ml",
    name: "Propolis Tincture",
    category: "Propolis",
    image: pPropolis,
    weight: "30ml",
    price: 950,
    stock: 22,
    badge: "Wellness",
    shortDesc: "Concentrated propolis extract for natural immune support.",
    description:
      "A potent alcohol-extracted tincture from raw Kenyan propolis. A few drops daily provide a rich source of flavonoids and natural compounds prized for centuries.",
    benefits: ["Antioxidant", "Immune support", "Traditional remedy"],
  },
  {
    id: "pollen-200",
    slug: "golden-bee-pollen",
    name: "Golden Bee Pollen",
    category: "Bee Pollen",
    image: pPollen,
    weight: "200g",
    price: 1200,
    stock: 15,
    badge: "Superfood",
    shortDesc: "Sun-dried pollen granules — a complete superfood.",
    description:
      "Carefully collected and gently dried to preserve every nutrient. Sprinkle over yoghurt, smoothies and porridge for a complete protein and vitamin boost.",
    benefits: ["Protein-rich", "Vitamins & minerals", "Energy boost"],
  },
  {
    id: "gift-trio",
    slug: "honey-gift-trio",
    name: "Honey Gift Trio",
    category: "Gift Packages",
    image: pGift,
    weight: "3 × 250g",
    price: 2400,
    oldPrice: 2700,
    stock: 12,
    badge: "Gift",
    shortDesc: "Three of our finest honeys in an elegant gift box.",
    description:
      "A beautifully presented gift trio featuring our raw honey, organic wildflower and processed clear honey — wrapped in a premium cream and gold gift box.",
    benefits: ["Premium packaging", "Corporate gifting", "Three varieties"],
  },
  {
    id: "gift-luxe",
    slug: "luxe-bee-collection",
    name: "Luxe Bee Collection",
    category: "Gift Packages",
    image: pGift,
    weight: "Curated set",
    price: 3800,
    stock: 8,
    shortDesc: "Honey, beeswax candle, propolis and pollen — the complete set.",
    description:
      "Our most luxurious gift — the complete bee experience in a single elegant box. Includes raw honey, a hand-poured beeswax candle, propolis tincture and a jar of bee pollen.",
    benefits: ["Complete collection", "Hand-poured candle", "Luxury box"],
  },
];

export const SHOP_CATEGORIES: ShopCategory[] = [
  "Raw Honey",
  "Processed Honey",
  "Beeswax",
  "Propolis",
  "Bee Pollen",
  "Gift Packages",
];

export function formatKES(n: number): string {
  return `KES ${n.toLocaleString("en-KE")}`;
}

export function findProduct(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}
