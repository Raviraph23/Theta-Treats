import {
  getDefaultVariant,
  getMinPrice,
  getProductPrice,
} from "@/lib/products/formatting";
import type { Product, ProductCategory } from "@/types/product";

export type ProductSort = "default" | "price-asc" | "price-desc" | "name";

export type ProductFilters = {
  query?: string;
  category?: ProductCategory | "all";
  tag?: string;
  sort?: ProductSort;
};

export function getProductTags(products: Product[]): string[] {
  const tags = new Set<string>();
  for (const product of products) {
    for (const tag of product.tags) {
      if (tag.trim()) tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

function matchesQuery(product: Product, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return (
    product.name.toLowerCase().includes(normalized) ||
    product.description.toLowerCase().includes(normalized) ||
    product.tags.some((tag) => tag.toLowerCase().includes(normalized)) ||
    product.id.toLowerCase().includes(normalized)
  );
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const {
    query = "",
    category = "all",
    tag = "",
    sort = "default",
  } = filters;

  let result = products.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (tag && !product.tags.includes(tag)) return false;
    if (!matchesQuery(product, query)) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return getMinPrice(a) - getMinPrice(b);
      case "price-desc":
        return getMinPrice(b) - getMinPrice(a);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    }
  });

  return result;
}

export function formatPriceRange(product: Product): string {
  const options =
    product.category === "brownie"
      ? (["500g", "750g", "1kg"] as const)
      : (["3", "6", "12"] as const);
  const prices = options.map((variant) => getProductPrice(product, variant));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `₹${min.toLocaleString("en-IN")}`;
  return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
}

export function getStartingPriceLabel(product: Product): string {
  const price = getProductPrice(product, getDefaultVariant(product));
  return `From ₹${price.toLocaleString("en-IN")}`;
}
