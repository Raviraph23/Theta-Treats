import type { PromoCodeRow } from "@/lib/supabase/database.types";

export type ValidatedPromo = {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  discountAmount: number;
};

export function calculatePromoDiscount(
  promo: Pick<PromoCodeRow, "discount_type" | "discount_value">,
  subtotal: number,
): number {
  if (promo.discount_type === "percent") {
    return Math.min(
      Math.round((subtotal * promo.discount_value) / 100),
      subtotal,
    );
  }
  return Math.min(promo.discount_value, subtotal);
}

export function validatePromoForOrder(
  promo: PromoCodeRow,
  subtotal: number,
  now = new Date(),
): { ok: true; discountAmount: number } | { ok: false; error: string } {
  if (!promo.is_active) {
    return { ok: false, error: "This promo code is no longer active." };
  }

  if (promo.expires_at && new Date(promo.expires_at) < now) {
    return { ok: false, error: "This promo code has expired." };
  }

  if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
    return { ok: false, error: "This promo code has reached its usage limit." };
  }

  if (subtotal < promo.min_order) {
    return {
      ok: false,
      error: `Minimum order of ₹${promo.min_order.toLocaleString("en-IN")} required for this code.`,
    };
  }

  const discountAmount = calculatePromoDiscount(promo, subtotal);
  if (discountAmount <= 0) {
    return { ok: false, error: "This promo code does not apply to your order." };
  }

  return { ok: true, discountAmount };
}

export function formatPromoLabel(promo: ValidatedPromo): string {
  if (promo.discountType === "percent") {
    return `${promo.code} (${promo.discountValue}% off)`;
  }
  return `${promo.code} (₹${promo.discountValue} off)`;
}
