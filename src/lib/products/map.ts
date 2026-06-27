import type {
  BrownieProduct,
  CookieProduct,
  PackPricing,
  Product,
  WeightPricing,
} from "@/types/product";
import { resolveProductImageSrc } from "@/lib/products/image-src";
import type { ProductRow } from "@/lib/supabase/database.types";

function parsePricing(
  category: "brownie" | "cookie",
  pricing: Record<string, number>,
): WeightPricing | PackPricing {
  if (category === "brownie") {
    return pricing as WeightPricing;
  }
  return pricing as PackPricing;
}

export function rowToProduct(row: ProductRow): Product {
  const base = {
    id: row.id,
    name: row.name,
    description: row.description,
    image: resolveProductImageSrc(row.image),
    tags: row.tags,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };

  if (row.category === "brownie") {
    return {
      ...base,
      category: "brownie",
      pricing: parsePricing("brownie", row.pricing) as WeightPricing,
    } satisfies BrownieProduct;
  }

  return {
    ...base,
    category: "cookie",
    pricing: parsePricing("cookie", row.pricing) as PackPricing,
  } satisfies CookieProduct;
}
