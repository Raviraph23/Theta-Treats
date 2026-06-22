import type { ProductCategory } from "@/data/products";
import {
  getVariantOptions,
  PACK_OPTIONS,
  WEIGHT_OPTIONS,
} from "@/data/products";

export const TAG_SUGGESTIONS = [
  "Bestseller",
  "Premium",
  "Luxury",
  "Classic",
  "Healthy",
  "Wholesome",
  "Bold",
  "Indulgent",
  "Local fusion",
  "Fan favourite",
] as const;

export function parsePricingFromForm(
  category: ProductCategory,
  formData: FormData,
): { pricing?: Record<string, number>; error?: string } {
  const variants =
    category === "brownie" ? WEIGHT_OPTIONS : PACK_OPTIONS;
  const pricing: Record<string, number> = {};

  for (const variant of variants) {
    const raw = formData.get(`price_${variant}`)?.toString();
    const price = Number(raw);
    if (!Number.isFinite(price) || price <= 0 || price > 100_000) {
      return { error: `Invalid price for ${variant}.` };
    }
    pricing[variant] = Math.round(price);
  }

  return { pricing };
}

export function parseTagFromForm(formData: FormData): string[] {
  const tag = formData.get("tag")?.toString().trim();
  return tag ? [tag] : [];
}

export { getVariantOptions };
