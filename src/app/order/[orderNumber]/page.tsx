import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrderByNumber } from "@/app/actions/orders";
import { OrderConfirmationRedirect } from "@/components/OrderConfirmationRedirect";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { formatPaidAt } from "@/lib/format/date";
import { formatPrice } from "@/lib/products/formatting";
import { isMockPaymentsEnabled } from "@/lib/payments/config";
import {
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/labels";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  ORDER_STATUS_LABELS,
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

  const whatsappMessage = buildWhatsAppMessage(
    order.order_number,
    order.customer_name,
    order.order_items,
    order.total,
    order.delivery_address,
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

      <div className="mt-8 rounded-2xl border border-accent/15 bg-primary/20 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground/60">Order ID</span>
          <span className="font-mono text-sm font-semibold text-accent">
            {order.order_number}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-foreground/60">Order status</span>
          <span className="text-sm font-medium">
            {ORDER_STATUS_LABELS[order.status]}
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

      {paymentComplete && <OrderConfirmationRedirect />}

      <Link
        href="/"
        className="mt-4 block text-center text-sm text-accent underline-offset-2 hover:underline"
      >
        Back to menu
      </Link>
    </div>
  );
}
