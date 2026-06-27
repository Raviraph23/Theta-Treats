import type { OrderWithItems } from "@/lib/supabase/database.types";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { formatDateTime } from "@/lib/format/date";
import { formatPrice } from "@/lib/products/formatting";
import { PAYMENT_STATUS_LABELS } from "@/lib/payments/labels";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildOrdersCsv(orders: OrderWithItems[]): string {
  const headers = [
    "Order Number",
    "Customer Name",
    "Phone",
    "Status",
    "Payment Status",
    "Subtotal",
    "Discount",
    "Delivery Fee",
    "Total",
    "Promo Code",
    "Delivery Date",
    "Delivery Slot",
    "Created At",
    "Items",
  ];

  const rows = orders.map((order) => {
    const items = order.order_items
      .map(
        (item) =>
          `${item.product_name} (${item.variant_label}) x${item.quantity}`,
      )
      .join("; ");

    return [
      order.order_number,
      order.customer_name,
      order.customer_phone,
      ORDER_STATUS_LABELS[order.status],
      PAYMENT_STATUS_LABELS[order.payment_status],
      order.subtotal ?? order.total,
      order.discount_amount,
      order.delivery_fee,
      order.total,
      order.promo_code ?? "",
      order.delivery_date ?? "",
      order.delivery_slot ?? "",
      formatDateTime(order.created_at),
      items,
    ]
      .map((cell) => escapeCsv(String(cell)))
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
