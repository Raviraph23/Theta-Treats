import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomerDetail } from "@/lib/admin/queries";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { formatDateFull, formatDateTime } from "@/lib/format/date";
import { formatPrice } from "@/lib/products/formatting";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { formatPhoneDisplay } from "@/lib/orders/validation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = await getCustomerDetail(id);

  if (!detail) notFound();

  const { customer, orders } = detail;
  const whatsappUrl = `https://wa.me/${customer.phone}`;

  return (
    <div>
      <Link
        href="/admin/customers"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← All customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {customer.name}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Customer since {formatDateFull(customer.created_at)}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#20bd5a]"
        >
          Message on WhatsApp
        </a>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-accent/15 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Contact
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-foreground/60">Phone</dt>
              <dd className="font-medium">
                {formatPhoneDisplay(customer.phone)}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/60">Last delivery address</dt>
              <dd className="font-medium">
                {customer.last_address ?? "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-accent/15 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            Activity
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-foreground/60">Total orders</dt>
              <dd className="font-medium">{customer.order_count}</dd>
            </div>
            <div>
              <dt className="text-foreground/60">Last order</dt>
              <dd className="font-medium">
                {orders.length > 0
                  ? formatDateTime(orders[0].created_at)
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Order history
        </h2>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">
            No orders found for this phone number.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-accent/15">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-accent/15 bg-primary/20">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-accent/10 last:border-0 hover:bg-primary/10"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-medium text-accent hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {ORDER_STATUS_LABELS[order.status]}
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={order.payment_status} />
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-foreground/70">
                      {formatDateTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
