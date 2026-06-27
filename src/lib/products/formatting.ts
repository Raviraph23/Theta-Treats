import {
  PACK_OPTIONS,
  WEIGHT_OPTIONS,
  type Product,
  type ProductVariant,
} from "@/types/product";

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

export function getMinPrice(product: Product): number {
  return Math.min(...getVariantOptions(product).map((v) => getProductPrice(product, v)));
}

export function getMaxPrice(product: Product): number {
  return Math.max(...getVariantOptions(product).map((v) => getProductPrice(product, v)));
}
