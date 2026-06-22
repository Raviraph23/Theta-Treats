export type WeightOption = "500g" | "750g" | "1kg";
export type PackOption = "3" | "6" | "12";
export type ProductVariant = WeightOption | PackOption;
export type ProductCategory = "brownie" | "cookie";

export type WeightPricing = Record<WeightOption, number>;
export type PackPricing = Record<PackOption, number>;

type BaseProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  isActive?: boolean;
  sortOrder?: number;
};

export type BrownieProduct = BaseProduct & {
  category: "brownie";
  pricing: WeightPricing;
};

export type CookieProduct = BaseProduct & {
  category: "cookie";
  pricing: PackPricing;
};

export type Product = BrownieProduct | CookieProduct;

export const WEIGHT_OPTIONS: WeightOption[] = ["500g", "750g", "1kg"];
export const PACK_OPTIONS: PackOption[] = ["3", "6", "12"];

export const COOKIE_IMAGES = {
  "classic-chocolate-chunk": "/cookies/classic-chocolate-chunk.png",
  "madras-filter-coffee": "/cookies/madras-filter-coffee.png",
  "oats-cranberry-almond": "/cookies/oats-cranberry-almond.png",
  "nutella-lava-bomb": "/cookies/nutella-lava-bomb.png",
  "red-velvet-cream-cheese": "/cookies/red-velvet-cream-cheese.png",
  "damascus-rose-pistachio": "/cookies/damascus-rose-pistachio.png",
} as const;

type CookieId = keyof typeof COOKIE_IMAGES;

function defineCookie(
  id: CookieId,
  cookie: Omit<CookieProduct, "id" | "category" | "image">,
): CookieProduct {
  return {
    ...cookie,
    id,
    category: "cookie",
    image: COOKIE_IMAGES[id],
  };
}

export const brownies: BrownieProduct[] = [
  {
    id: "classic-fudgy",
    category: "brownie",
    name: "Classic Fudgy Brownies",
    description:
      "Rich, dense, and deeply chocolatey. Our signature brownie with a crackly top and molten fudgy center.",
    pricing: { "500g": 750, "750g": 1125, "1kg": 1500 },
    image: "/brownies/classic-fudgy-brownie.png",
    tags: ["Bestseller"],
  },
  {
    id: "banana-walnut",
    category: "brownie",
    name: "Banana Walnut Brownies",
    description:
      "Ripe banana folded into fudgy chocolate batter with toasted walnuts for a wholesome, nutty bite.",
    pricing: { "500g": 875, "750g": 1310, "1kg": 1750 },
    image: "/brownies/banana-walnut-brownie.png",
    tags: ["Wholesome"],
  },
  {
    id: "rich-coffee",
    category: "brownie",
    name: "Rich Coffee Brownies",
    description:
      "Dark chocolate meets bold espresso in a deeply indulgent brownie with a subtle coffee kick.",
    pricing: { "500g": 800, "750g": 1200, "1kg": 1600 },
    image: "/brownies/rich-coffee-brownie.png",
    tags: ["Bold"],
  },
  {
    id: "lotus-biscoff",
    category: "brownie",
    name: "Lotus Biscoff Brownies",
    description:
      "Caramelized Biscoff biscuit crumbs swirled through chocolate brownie — buttery, spiced, irresistible.",
    pricing: { "500g": 950, "750g": 1425, "1kg": 1900 },
    image: "/brownies/lotus-biscoff-brownie.png",
    tags: ["Fan favourite"],
  },
  {
    id: "pistachio",
    category: "brownie",
    name: "Pistachio Brownies",
    description:
      "Premium pistachios baked into rich chocolate with a delicate green pistachio drizzle on top.",
    pricing: { "500g": 1000, "750g": 1500, "1kg": 2000 },
    image: "/brownies/pistachio-brownie.png",
    tags: ["Premium"],
  },
  {
    id: "oreo",
    category: "brownie",
    name: "Oreo Brownies",
    description:
      "Creamy cookie chunks and crushed Oreo folded into fudgy chocolate — a playful classic twist.",
    pricing: { "500g": 850, "750g": 1275, "1kg": 1700 },
    image: "/brownies/oreo-brownie.png",
    tags: ["Indulgent"],
  },
];

export const cookies: CookieProduct[] = [
  defineCookie("classic-chocolate-chunk", {
    name: "Classic Chocolate Chunk",
    description:
      "Generous dark chocolate chunks in a buttery, golden cookie — our everyday favourite at ₹100 per piece.",
    pricing: { "3": 300, "6": 540, "12": 960 },
    tags: ["Classic"],
  }),
  defineCookie("madras-filter-coffee", {
    name: "Madras Filter Coffee Dark Choc",
    description:
      "Roasted chicory-coffee infusion swirled through dark chocolate — a Chennai-inspired local fusion.",
    pricing: { "3": 330, "6": 590, "12": 1050 },
    tags: ["Local fusion"],
  }),
  defineCookie("oats-cranberry-almond", {
    name: "Toasted Oats, Cranberry & Almond",
    description:
      "Wholesome toasted oats with real dried cranberries and crunchy almonds — a health-forward indulgence.",
    pricing: { "3": 350, "6": 630, "12": 1120 },
    tags: ["Healthy"],
  }),
  defineCookie("nutella-lava-bomb", {
    name: "Nutella Lava Bomb",
    description:
      "Gooey Nutella cores piped and frozen before baking — an Instagram-worthy stuffed cookie experience.",
    pricing: { "3": 400, "6": 720, "12": 1280 },
    tags: ["Luxury"],
  }),
  defineCookie("red-velvet-cream-cheese", {
    name: "Red Velvet Cream Cheese",
    description:
      "Vibrant red velvet cookie with a rich eggless cream cheese filling — stunning inside and out.",
    pricing: { "3": 420, "6": 750, "12": 1340 },
    tags: ["Luxury"],
  }),
  defineCookie("damascus-rose-pistachio", {
    name: "Damascus Rose & Pistachio",
    description:
      "Delicate Damascus rose and crushed pistachios in a luxury botanical cookie — floral, nutty, unforgettable.",
    pricing: { "3": 450, "6": 800, "12": 1440 },
    tags: ["Luxury"],
  }),
];

/** Static seed catalog — used only for reference; runtime reads from Supabase. */
export const products: Product[] = [...brownies, ...cookies];

export function getVariantOptions(product: Product): ProductVariant[] {
  return product.category === "brownie" ? WEIGHT_OPTIONS : PACK_OPTIONS;
}

export function getDefaultVariant(product: Product): ProductVariant {
  return product.category === "brownie" ? "500g" : "3";
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getProductPrice(
  product: Product,
  variant: ProductVariant,
): number {
  return product.pricing[variant as keyof typeof product.pricing];
}

export function formatVariantLabel(
  product: Product,
  variant: ProductVariant,
): string {
  if (product.category === "brownie") {
    return variant === "1kg" ? "1 kg" : variant;
  }
  return `Pack of ${variant}`;
}

export function getVariantGroupLabel(product: Product): string {
  return product.category === "brownie" ? "Size" : "Pack";
}