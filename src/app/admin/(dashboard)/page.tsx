import Link from "next/link";
import { AdminProductionList } from "@/components/admin/AdminProductionList";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminWeeklyChart } from "@/components/admin/AdminWeeklyChart";
import { getOrders } from "@/lib/admin/queries";
import {
  computeDashboardStats,
  computeProductionSummary,
  computeWeeklyMetrics,
} from "@/lib/admin/stats";
import { formatDateTime } from "@/lib/format/date";
import { formatPrice } from "@/lib/products/formatting";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";

export default async function AdminDashboardPage() {
  const orders = await getOrders();
  const stats = computeDashboardStats(orders);
  const weeklyMetrics = computeWeeklyMetrics(orders);
  const production = computeProductionSummary(orders);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Business overview for today and the last 7 days.
        </p>
      </div>

      <AdminStatsCards stats={stats} />

      <AdminWeeklyChart metrics={weeklyMetrics} />

      <AdminProductionList summary={production} compact />

      <div className="rounded-2xl border border-accent/15 bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-accent/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-accent/10 bg-primary/20">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">
                      {ORDER_STATUS_LABELS[order.status]}
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
    </div>
  );
}
