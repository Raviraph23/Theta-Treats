import type { Product } from "@/types/product";

const FEATURED_TAG_PRIORITY = [
  "Bestseller",
  "Fan favourite",
  "Premium",
  "Luxury",
] as const;

/** Curated homepage picks — tagged favourites first, then a balanced mix. */
export function getFeaturedProducts(
  products: Product[],
  limit = 4,
): Product[] {
  const selected: Product[] = [];
  const used = new Set<string>();

  const add = (product: Product) => {
    if (selected.length >= limit || used.has(product.id)) return;
    selected.push(product);
    used.add(product.id);
  };

  for (const tag of FEATURED_TAG_PRIORITY) {
    for (const product of products) {
      if (product.tags.includes(tag)) add(product);
    }
  }

  const brownies = products.filter((p) => p.category === "brownie");
  const cookies = products.filter((p) => p.category === "cookie");
  const maxEach = Math.ceil(limit / 2);

  for (const product of brownies.slice(0, maxEach)) add(product);
  for (const product of cookies.slice(0, maxEach)) add(product);

  for (const product of products) add(product);

  return selected.slice(0, limit);
}
