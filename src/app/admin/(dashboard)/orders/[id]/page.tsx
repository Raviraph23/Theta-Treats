import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/admin/queries";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { formatPrice } from "@/data/products";
import {
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/labels";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { formatPhoneDisplay } from "@/lib/orders/validation";
import { SITE } from "@/lib/constants";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatPaidAt(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const whatsappUrl = `https://wa.me/${order.customer_phone}`;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Placed {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-accent/15 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Customer
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-foreground/60">Name</dt>
              <dd className="font-medium">{order.customer_name}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Phone</dt>
              <dd>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#25D366] hover:underline"
                >
                  {formatPhoneDisplay(order.customer_phone)} — WhatsApp
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-foreground/60">Delivery address</dt>
              <dd>{order.delivery_address}</dd>
            </div>
            {order.notes && (
              <div>
                <dt className="text-foreground/60">Notes</dt>
                <dd>{order.notes}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-2xl border border-accent/15 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Summary
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/60">Status</dt>
              <dd className="font-medium">
                {ORDER_STATUS_LABELS[order.status]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/60">Payment</dt>
              <dd>
                <PaymentStatusBadge status={order.payment_status} />
              </dd>
            </div>
            {order.payment_method && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">Payment method</dt>
                <dd className="font-medium">
                  {PAYMENT_METHOD_LABELS[order.payment_method]}
                </dd>
              </div>
            )}
            {order.payment_reference && (
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-foreground/60">Reference</dt>
                <dd className="truncate font-mono text-xs font-medium">
                  {order.payment_reference}
                </dd>
              </div>
            )}
            {order.paid_at && (
              <div className="flex justify-between">
                <dt className="text-foreground/60">Paid at</dt>
                <dd className="font-medium">{formatPaidAt(order.paid_at)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-foreground/60">Total</dt>
              <dd className="text-lg font-bold text-accent">
                {formatPrice(order.total)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/60">Items</dt>
              <dd>{order.order_items.length}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-accent/15 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          Items
        </h2>
        <ul className="mt-4 divide-y divide-accent/10">
          {order.order_items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-3 text-sm first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-foreground/60">
                  {item.variant_label} × {item.quantity} @{" "}
                  {formatPrice(item.unit_price)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.line_total)}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white"
        >
          Message customer on WhatsApp
        </a>
        <a
          href={`https://wa.me/${SITE.phoneRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center rounded-full border border-accent/30 px-6 text-sm font-semibold text-foreground"
        >
          Open {SITE.name} WhatsApp
        </a>
      </div>
    </div>
  );
}
