"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { calculateOrderPricing } from "@/lib/commerce/pricing";
import { validatePromoForOrder } from "@/lib/commerce/promo";
import { getStoreSettings } from "@/lib/commerce/settings";
import { getCatalogForValidation } from "@/lib/products/catalog";
import {
  validateCartLines,
  type CartLineInput,
} from "@/lib/orders/validation";
import { getProductsSoldToday } from "@/lib/commerce/stock";

export type ValidatePromoResult =
  | {
      success: true;
      code: string;
      discountType: "percent" | "fixed";
      discountValue: number;
      discountAmount: number;
    }
  | { success: false; error: string };

export async function validatePromoCode(
  code: string,
  subtotal: number,
): Promise<ValidatePromoResult> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) {
    return { success: false, error: "Enter a promo code." };
  }

  if (subtotal <= 0) {
    return { success: false, error: "Add items to your cart first." };
  }

  try {
    const supabase = createAdminClient();
    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", trimmed)
      .maybeSingle();

    if (error || !promo) {
      return { success: false, error: "Invalid promo code." };
    }

    const result = validatePromoForOrder(promo, subtotal);
    if (!result.ok) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: promo.discount_value,
      discountAmount: result.discountAmount,
    };
  } catch (err) {
    console.error("validatePromoCode error:", err);
    return { success: false, error: "Could not validate promo code." };
  }
}

export type CheckoutPreviewInput = {
  items: CartLineInput[];
  deliveryAddress: string;
  promoCode?: string;
};

export type CheckoutPreviewResult =
  | {
      success: true;
      subtotal: number;
      discountAmount: number;
      deliveryFee: number;
      total: number;
      promoCode: string | null;
      deliveryZoneLabel: string | null;
      freeDelivery: boolean;
      minOrderAmount: number;
      meetsMinOrder: boolean;
    }
  | { success: false; error: string };

export async function getCheckoutPreview(
  input: CheckoutPreviewInput,
): Promise<CheckoutPreviewResult> {
  const catalog = await getCatalogForValidation();
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const soldToday = await getProductsSoldToday(productIds);

  const validated = validateCartLines(input.items, catalog, soldToday);
  if (!validated.ok) {
    return { success: false, error: validated.error };
  }

  const settings = await getStoreSettings();
  let promoRow = null;

  if (input.promoCode?.trim()) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", input.promoCode.trim().toUpperCase())
      .maybeSingle();

    if (data) {
      const promoResult = validatePromoForOrder(data, validated.total);
      if (promoResult.ok) {
        promoRow = data;
      }
    }
  }

  const pricing = calculateOrderPricing(
    validated.total,
    input.deliveryAddress,
    settings,
    promoRow,
  );

  return {
    success: true,
    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    deliveryFee: pricing.deliveryFee,
    total: pricing.total,
    promoCode: pricing.promo?.code ?? null,
    deliveryZoneLabel: pricing.deliveryZoneLabel,
    freeDelivery: pricing.freeDelivery,
    minOrderAmount: settings.minOrderAmount,
    meetsMinOrder: pricing.subtotal >= settings.minOrderAmount,
  };
}
