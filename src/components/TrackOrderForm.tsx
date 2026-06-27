"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { trackOrder } from "@/app/actions/orders";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { ReorderButton } from "@/components/ReorderButton";
import { formatPaidAt } from "@/lib/format/date";
import {
  formatDeliverySlot,
  formatOccasion,
} from "@/lib/orders/delivery-slots";
import { formatPhoneDisplay } from "@/lib/orders/validation";
import { formatPrice } from "@/lib/products/formatting";
import {
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/labels";
import type { OrderWithItems } from "@/lib/supabase/database.types";

export function TrackOrderForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderWithItems | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    setOrder(null);

    startTransition(async () => {
      const result = await trackOrder(
        formData.get("orderNumber")?.toString() ?? "",
        formData.get("customerPhone")?.toString() ?? "",
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOrder(result.order);

      if (result.order.payment_status === "pending") {
        router.push(`/order/${result.order.order_number}/pay`);
      }
    });
  }

  if (order) {
    const deliverySlotLabel = formatDeliverySlot(
      order.delivery_date,
      order.delivery_slot,
    );
    const occasionLabel = formatOccasion(order.occasion);

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-accent/15 bg-primary/20 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-foreground/60">Order ID</span>
            <span className="font-mono text-sm font-semibold text-accent">
              {order.order_number}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-foreground/60">Payment</span>
            <PaymentStatusBadge status={order.payment_status} />
          </div>
          {order.payment_method && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-foreground/60">Method</span>
              <span className="text-sm font-medium">
                {PAYMENT_METHOD_LABELS[order.payment_method]}
              </span>
            </div>
          )}
          {order.paid_at && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-foreground/60">Paid at</span>
              <span className="text-sm font-medium">
                {formatPaidAt(order.paid_at)}
              </span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-foreground/60">Total</span>
            <span className="text-lg font-bold text-accent">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        <OrderStatusTimeline status={order.status} />

        <div className="space-y-3 rounded-2xl border border-accent/10 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Details
          </h2>
          <p className="text-sm">
            <span className="text-foreground/60">Name: </span>
            {order.customer_name}
          </p>
          <p className="text-sm">
            <span className="text-foreground/60">Phone: </span>
            {formatPhoneDisplay(order.customer_phone)}
          </p>
          <p className="text-sm">
            <span className="text-foreground/60">Delivery: </span>
            {order.delivery_address}
          </p>
          {deliverySlotLabel && (
            <p className="text-sm">
              <span className="text-foreground/60">Delivery slot: </span>
              {deliverySlotLabel}
            </p>
          )}
          {occasionLabel && (
            <p className="text-sm">
              <span className="text-foreground/60">Occasion: </span>
              {occasionLabel}
            </p>
          )}
          {order.gift_message && (
            <p className="text-sm">
              <span className="text-foreground/60">Gift message: </span>
              {order.gift_message}
            </p>
          )}
          {order.notes && (
            <p className="text-sm">
              <span className="text-foreground/60">Notes: </span>
              {order.notes}
            </p>
          )}
        </div>

        <ul className="space-y-2">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product_name} ({item.variant_label}) × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>

        <ReorderButton items={order.order_items} />

        <button
          type="button"
          onClick={() => setOrder(null)}
          className="w-full py-2 text-center text-sm text-accent underline-offset-2 hover:underline"
        >
          Track another order
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium">
          Order number
        </label>
        <input
          id="orderNumber"
          name="orderNumber"
          required
          autoComplete="off"
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 font-mono text-sm outline-none focus:border-accent"
          placeholder="TT-20260327-1234"
        />
      </div>

      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium">
          Phone number
        </label>
        <input
          id="customerPhone"
          name="customerPhone"
          type="tel"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          placeholder="10-digit mobile number used at checkout"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {isPending ? "Looking up order…" : "Track order"}
      </button>
    </form>
  );
}
