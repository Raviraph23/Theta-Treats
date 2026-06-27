import { calculateDeliveryFee } from "@/lib/commerce/delivery";
import {
  calculatePromoDiscount,
  type ValidatedPromo,
} from "@/lib/commerce/promo";
import type { StoreSettings } from "@/lib/commerce/constants";
import type { PromoCodeRow } from "@/lib/supabase/database.types";

export type OrderPricing = {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  promo: ValidatedPromo | null;
  deliveryZoneLabel: string | null;
  freeDelivery: boolean;
};

export function calculateOrderPricing(
  subtotal: number,
  deliveryAddress: string,
  settings: StoreSettings,
  promo: PromoCodeRow | null = null,
): OrderPricing {
  const discountAmount = promo
    ? calculatePromoDiscount(promo, subtotal)
    : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;

  const delivery = calculateDeliveryFee(
    subtotalAfterDiscount,
    deliveryAddress,
    settings,
  );

  const total = subtotalAfterDiscount + delivery.fee;

  const validatedPromo: ValidatedPromo | null =
    promo && discountAmount > 0
      ? {
          code: promo.code,
          discountType: promo.discount_type,
          discountValue: promo.discount_value,
          discountAmount,
        }
      : null;

  return {
    subtotal,
    discountAmount,
    deliveryFee: delivery.fee,
    total,
    promo: validatedPromo,
    deliveryZoneLabel: delivery.zoneLabel,
    freeDelivery: delivery.isFree,
  };
}
