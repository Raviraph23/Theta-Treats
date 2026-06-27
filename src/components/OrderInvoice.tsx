"use client";

import { formatDateTimeFull, formatPaidAt } from "@/lib/format/date";
import { formatDeliverySlot, formatOccasion } from "@/lib/orders/delivery-slots";
import { formatPhoneDisplay } from "@/lib/orders/validation";
import { formatPrice } from "@/lib/products/formatting";
import {
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/labels";
import { SITE } from "@/lib/constants";
import type { OrderWithItems } from "@/lib/supabase/database.types";

type OrderInvoiceProps = {
  order: OrderWithItems;
};

export function OrderInvoice({ order }: OrderInvoiceProps) {
  const deliverySlotLabel = formatDeliverySlot(
    order.delivery_date,
    order.delivery_slot,
  );
  const occasionLabel = formatOccasion(order.occasion);
  const subtotal = order.subtotal ?? order.total;

  return (
    <div id="order-invoice" className="hidden print:block">
      <div className="mx-auto max-w-lg p-8 text-black">
        <header className="border-b border-gray-300 pb-4">
          <h1 className="font-display text-2xl font-bold">{SITE.name}</h1>
          <p className="text-sm text-gray-600">{SITE.tagline}</p>
          <p className="mt-2 text-xs text-gray-500">
            {SITE.email} · {SITE.phone}
          </p>
        </header>

        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="font-semibold">Tax Invoice / Receipt</p>
            <p className="font-mono">{order.order_number}</p>
            <p className="text-gray-600">
              {formatDateTimeFull(order.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold capitalize">{order.payment_status}</p>
            {order.payment_method && (
              <p>{PAYMENT_METHOD_LABELS[order.payment_method]}</p>
            )}
            {order.payment_reference && (
              <p className="font-mono text-xs">{order.payment_reference}</p>
            )}
            {order.paid_at && (
              <p className="text-gray-600">{formatPaidAt(order.paid_at)}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Bill to</p>
            <p>{order.customer_name}</p>
            <p>{formatPhoneDisplay(order.customer_phone)}</p>
            <p className="text-gray-600">{order.delivery_address}</p>
          </div>
          <div>
            {deliverySlotLabel && (
              <>
                <p className="font-semibold">Delivery slot</p>
                <p>{deliverySlotLabel}</p>
              </>
            )}
            {occasionLabel && <p>Occasion: {occasionLabel}</p>}
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">
                  {item.product_name}
                  <span className="block text-xs text-gray-500">
                    {item.variant_label}
                  </span>
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">
                  {formatPrice(item.unit_price)}
                </td>
                <td className="py-2 text-right">
                  {formatPrice(item.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between">
              <dt>
                Discount
                {order.promo_code ? ` (${order.promo_code})` : ""}
              </dt>
              <dd>−{formatPrice(order.discount_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>
              {order.delivery_fee === 0
                ? "Free"
                : formatPrice(order.delivery_fee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        {order.gift_message && (
          <p className="mt-4 text-sm text-gray-600">
            Gift message: {order.gift_message}
          </p>
        )}
        {order.notes && (
          <p className="mt-2 text-sm text-gray-600">Notes: {order.notes}</p>
        )}

        <footer className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
          Thank you for ordering from {SITE.name}! This is a computer-generated
          receipt.
        </footer>
      </div>
    </div>
  );
}

export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mt-4 flex h-11 w-full items-center justify-center rounded-full border border-accent/30 text-sm font-semibold text-foreground transition active:scale-[0.98]"
    >
      Print / download invoice
    </button>
  );
}
