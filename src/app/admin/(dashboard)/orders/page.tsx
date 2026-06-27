import Link from "next/link";
import { getOrders } from "@/lib/admin/queries";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { formatDateTime } from "@/lib/format/date";
import { formatPrice } from "@/lib/products/formatting";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { formatPhoneDisplay } from "@/lib/orders/validation";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Orders
        </h1>
        <span className="text-sm text-foreground/60">
          {orders.length} total
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">
          No orders yet. They&apos;ll appear here when customers checkout.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-accent/15">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-accent/15 bg-primary/20">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
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
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-foreground/60">
                      {formatPhoneDisplay(order.customer_phone)}
                    </p>
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
    </div>
  );
}
