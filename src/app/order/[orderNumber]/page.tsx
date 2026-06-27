import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderByNumber } from "@/app/actions/orders";
import { OrderConfirmationRedirect } from "@/components/OrderConfirmationRedirect";
import { OrderInvoice, PrintInvoiceButton } from "@/components/OrderInvoice";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { ReorderButton } from "@/components/ReorderButton";
import { formatPaidAt } from "@/lib/format/date";
import {
  formatDeliverySlot,
  formatOccasion,
} from "@/lib/orders/delivery-slots";
import { formatPrice } from "@/lib/products/formatting";
import { isMockPaymentsEnabled } from "@/lib/payments/config";
import {
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/labels";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/orders/whatsapp";
import { formatPhoneDisplay } from "@/lib/orders/validation";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: "Your Theta Treats order confirmation.",
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  if (
    order.payment_status === "pending" &&
    isMockPaymentsEnabled()
  ) {
    redirect(`/order/${orderNumber}/pay`);
  }

  const deliverySlotLabel = formatDeliverySlot(
    order.delivery_date,
    order.delivery_slot,
  );
  const occasionLabel = formatOccasion(order.occasion);

  const whatsappMessage = buildWhatsAppMessage(
    order.order_number,
    order.customer_name,
    order.order_items,
    order.total,
    order.delivery_address,
    {
      deliveryDate: order.delivery_date,
      deliverySlot: order.delivery_slot,
      giftMessage: order.gift_message,
      occasion: order.occasion,
      notes: order.notes,
      subtotal: order.subtotal,
      discountAmount: order.discount_amount,
      deliveryFee: order.delivery_fee,
      promoCode: order.promo_code,
    },
  );
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  const paymentComplete =
    order.payment_status === "paid" || order.payment_status === "cod";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="text-center">
        <span className="text-4xl" aria-hidden>
          ✓
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
          {paymentComplete ? "Order confirmed!" : "Order placed!"}
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          {order.payment_status === "paid"
            ? "Payment received. Confirm on WhatsApp and we'll get back to you shortly."
            : order.payment_status === "cod"
              ? "Cash on delivery selected. Confirm on WhatsApp and we'll get back to you shortly."
              : "We've received your order. Confirm on WhatsApp and we'll get back to you shortly."}
        </p>
      </div>

      <div className="mt-8">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mt-6 rounded-2xl border border-accent/15 bg-primary/20 p-5">
        <div className="flex items-center justify-between">
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
        {order.payment_reference && (
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="shrink-0 text-sm text-foreground/60">
              Reference
            </span>
            <span className="truncate font-mono text-xs font-medium">
              {order.payment_reference}
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
        {(order.subtotal != null && order.subtotal !== order.total) ||
        order.discount_amount > 0 ||
        order.delivery_fee > 0 ? (
          <div className="mt-3 space-y-1 border-t border-accent/10 pt-3 text-xs text-foreground/60">
            {order.subtotal != null && (
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
            )}
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>
                  Discount
                  {order.promo_code ? ` (${order.promo_code})` : ""}
                </span>
                <span>−{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {order.delivery_fee === 0
                  ? "Free"
                  : formatPrice(order.delivery_fee)}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border border-accent/10 p-5">
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

      <ul className="mt-6 space-y-2">
        {order.order_items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.product_name} ({item.variant_label}) × {item.quantity}
            </span>
            <span className="font-medium">{formatPrice(item.line_total)}</span>
          </li>
        ))}
      </ul>

      {order.payment_status === "pending" && (
        <Link
          href={`/order/${order.order_number}/pay`}
          className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98]"
        >
          Complete payment
        </Link>
      )}

      {paymentComplete && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          Continue on WhatsApp
        </a>
      )}

      {paymentComplete && (
        <div className="mt-3">
          <ReorderButton items={order.order_items} />
        </div>
      )}

      {paymentComplete && <PrintInvoiceButton />}

      {paymentComplete && <OrderConfirmationRedirect />}

      <OrderInvoice order={order} />

      <Link
        href="/track"
        className="mt-4 block text-center text-sm text-foreground/70 underline-offset-2 hover:text-accent hover:underline"
      >
        Track this order anytime
      </Link>

      <Link
        href="/"
        className="mt-2 block text-center text-sm text-accent underline-offset-2 hover:underline"
      >
        Back to menu
      </Link>
    </div>
  );
}
