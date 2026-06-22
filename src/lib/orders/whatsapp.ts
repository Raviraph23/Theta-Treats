import { formatPrice } from "@/data/products";
import { SITE } from "@/lib/constants";
import type { OrderItem } from "@/lib/supabase/database.types";

export function buildWhatsAppMessage(
  orderNumber: string,
  customerName: string,
  items: Pick<OrderItem, "product_name" | "variant_label" | "quantity" | "line_total">[],
  total: number,
  deliveryAddress: string,
): string {
  const lines = items.map(
    (i) =>
      `• ${i.product_name} (${i.variant_label}) × ${i.quantity} — ${formatPrice(i.line_total)}`,
  );

  return encodeURIComponent(
    `Hi ${SITE.name}! I'd like to place an order.\n\n` +
      `Order ID: ${orderNumber}\n` +
      `Name: ${customerName}\n` +
      `Delivery: ${deliveryAddress}\n\n` +
      `${lines.join("\n")}\n\n` +
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
