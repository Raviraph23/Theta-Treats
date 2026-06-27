import { formatPrice } from "@/lib/products/formatting";
import { SITE } from "@/lib/constants";
import {
  formatDeliverySlot,
  formatOccasion,
} from "@/lib/orders/delivery-slots";
import type { OrderItem } from "@/lib/supabase/database.types";

export type OrderMessageExtras = {
  deliveryDate?: string | null;
  deliverySlot?: import("@/lib/supabase/database.types").DeliverySlot | null;
  giftMessage?: string | null;
  occasion?: string | null;
  notes?: string | null;
  subtotal?: number | null;
  discountAmount?: number;
  deliveryFee?: number;
  promoCode?: string | null;
};

export function buildWhatsAppMessage(
  orderNumber: string,
  customerName: string,
  items: Pick<OrderItem, "product_name" | "variant_label" | "quantity" | "line_total">[],
  total: number,
  deliveryAddress: string,
  extras: OrderMessageExtras = {},
): string {
  const lines = items.map(
    (i) =>
      `• ${i.product_name} (${i.variant_label}) × ${i.quantity} — ${formatPrice(i.line_total)}`,
  );

  const deliverySlotLabel = formatDeliverySlot(
    extras.deliveryDate ?? null,
    extras.deliverySlot ?? null,
  );
  const occasionLabel = formatOccasion(extras.occasion ?? null);

  const detailLines = [
    `Order ID: ${orderNumber}`,
    `Name: ${customerName}`,
    `Delivery: ${deliveryAddress}`,
    deliverySlotLabel ? `Preferred slot: ${deliverySlotLabel}` : null,
    occasionLabel ? `Occasion: ${occasionLabel}` : null,
    extras.giftMessage ? `Gift message: ${extras.giftMessage}` : null,
    extras.notes ? `Notes: ${extras.notes}` : null,
  ].filter(Boolean);

  const pricingLines = [
    extras.subtotal != null && extras.subtotal !== total
      ? `Subtotal: ${formatPrice(extras.subtotal)}`
      : null,
    extras.discountAmount && extras.discountAmount > 0
      ? `Discount${extras.promoCode ? ` (${extras.promoCode})` : ""}: −${formatPrice(extras.discountAmount)}`
      : null,
    extras.deliveryFee != null && extras.deliveryFee > 0
      ? `Delivery: ${formatPrice(extras.deliveryFee)}`
      : extras.deliveryFee === 0 && extras.subtotal != null
        ? "Delivery: Free"
        : null,
  ].filter(Boolean);

  return encodeURIComponent(
    `Hi ${SITE.name}! I'd like to place an order.\n\n` +
      `${detailLines.join("\n")}\n\n` +
      `${lines.join("\n")}\n\n` +
      (pricingLines.length > 0 ? `${pricingLines.join("\n")}\n` : "") +
      `Total: ${formatPrice(total)}\n\n` +
      `Please confirm availability and delivery details. Thank you!`,
  );
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${SITE.phoneRaw}?text=${message}`;
}

export const ORDER_STATUS_LABELS: Record<
  import("@/lib/supabase/database.types").OrderStatus,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ADMIN_STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
