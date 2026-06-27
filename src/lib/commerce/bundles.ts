import { getProductPrice } from "@/lib/products/formatting";
import type { Product, ProductVariant } from "@/types/product";

export type BundleItem = {
  productId: string;
  variant: ProductVariant;
};

export type BundleOffer = {
  id: string;
  name: string;
  description: string;
  tag: string;
  items: BundleItem[];
};

export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: "brownie-duo",
    name: "Brownie Duo",
    description:
      "Two classic 500g brownies — perfect for sharing or treating yourself twice.",
    tag: "Combo",
    items: [
      { productId: "classic-fudgy", variant: "500g" },
      { productId: "lotus-biscoff", variant: "500g" },
    ],
  },
  {
    id: "cookie-party-pack",
    name: "Cookie Party Pack",
    description:
      "A dozen chocolate chunk cookies plus a half-kilo fudgy brownie for the table.",
    tag: "Best value",
    items: [
      { productId: "classic-chocolate-chunk", variant: "12" },
      { productId: "classic-fudgy", variant: "500g" },
    ],
  },
  {
    id: "premium-indulgence",
    name: "Premium Indulgence",
    description:
      "Nutella lava cookies and pistachio brownie — our luxury picks in one order.",
    tag: "Premium",
    items: [
      { productId: "nutella-lava-bomb", variant: "6" },
      { productId: "pistachio", variant: "500g" },
    ],
  },
];

export type ResolvedBundleItem = BundleItem & {
  product: Product;
  unitPrice: number;
};

export type ResolvedBundle = Omit<BundleOffer, "items"> & {
  image: string;
  items: ResolvedBundleItem[];
  totalPrice: number;
  itemCount: number;
};

export function resolveBundles(catalog: Product[]): ResolvedBundle[] {
  return BUNDLE_OFFERS.map((bundle) => {
    const resolvedItems = bundle.items
      .map((item) => {
        const product = catalog.find((p) => p.id === item.productId);
        if (!product) return null;
        const unitPrice = getProductPrice(product, item.variant);
        if (!Number.isFinite(unitPrice) || unitPrice <= 0) return null;
        return { ...item, product, unitPrice };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (resolvedItems.length !== bundle.items.length) return null;

    const totalPrice = resolvedItems.reduce((sum, item) => sum + item.unitPrice, 0);

    return {
      ...bundle,
      image: resolvedItems[0]?.product.image ?? "",
      items: resolvedItems,
      totalPrice,
      itemCount: resolvedItems.length,
    };
  }).filter((bundle): bundle is ResolvedBundle => bundle !== null);
}
