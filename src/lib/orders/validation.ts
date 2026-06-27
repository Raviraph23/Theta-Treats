import type { ProductVariant } from "@/types/product";
import {
  formatVariantLabel,
  getProductPrice,
} from "@/lib/products/formatting";
import type { Product } from "@/types/product";
import { isProductSoldOut } from "@/lib/commerce/stock";

export type CartLineInput = {
  productId: string;
  variant: string;
  quantity: number;
};

export type ValidatedCartLine = {
  productId: string;
  productName: string;
  variant: ProductVariant;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export function validateCartLines(
  items: CartLineInput[],
  catalog: Product[],
  soldToday: Record<string, number> = {},
): { ok: true; lines: ValidatedCartLine[]; total: number } | { ok: false; error: string } {
  if (!items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (items.length > 50) {
    return { ok: false, error: "Too many items in cart." };
  }

  const lines: ValidatedCartLine[] = [];
  let total = 0;

  for (const item of items) {
    if (!item.productId || !item.variant) {
      return { ok: false, error: "Invalid cart item." };
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return { ok: false, error: "Invalid quantity." };
    }

    const product = catalog.find((p) => p.id === item.productId);
    if (!product) {
      return { ok: false, error: "Unknown product in cart." };
    }

    if (product.isActive === false) {
      return {
        ok: false,
        error: `${product.name} is currently unavailable.`,
      };
    }

    const soldCount = soldToday[product.id] ?? 0;
    if (isProductSoldOut(product, soldCount, quantity)) {
      return {
        ok: false,
        error: `${product.name} is sold out.`,
      };
    }

    const variant = item.variant as ProductVariant;
    const price = getProductPrice(product, variant);
    if (!Number.isFinite(price) || price <= 0) {
      return { ok: false, error: "Invalid product variant." };
    }

    const lineTotal = price * quantity;
    lines.push({
      productId: product.id,
      productName: product.name,
      variant,
      variantLabel: formatVariantLabel(product, variant),
      quantity,
      unitPrice: price,
      lineTotal,
    });
    total += lineTotal;
  }

  return { ok: true, lines, total };
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
}

export function isValidIndianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^91[6-9]\d{9}$/.test(normalized);
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length === 12 && normalized.startsWith("91")) {
    return `+91 ${normalized.slice(2, 7)} ${normalized.slice(7)}`;
  }
  return phone;
}
