import Link from "next/link";
import { formatDateFull } from "@/lib/format/date";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { DELIVERY_SLOT_LABELS } from "@/lib/orders/delivery-slots";
import type { DeliverySlot } from "@/lib/supabase/database.types";
import type { ProductionSummary } from "@/lib/admin/stats";

type AdminProductionListProps = {
  summary: ProductionSummary;
  compact?: boolean;
};

export function AdminProductionList({
  summary,
  compact = false,
}: AdminProductionListProps) {
  const { lines, orders, date } = summary;

  return (
    <div className="rounded-2xl border border-accent/15 bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Today&apos;s bake list
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Delivery for {formatDateFull(`${date}T12:00:00+05:30`)}
          </p>
        </div>
        {!compact && (
          <Link
            href="/admin/production"
            className="text-sm font-medium text-accent hover:underline"
          >
            Full view
          </Link>
        )}
      </div>

      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/60">
          No orders scheduled for delivery today.
        </p>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-xl border border-accent/10">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-accent/10 bg-primary/20">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Variant</th>
                  <th className="px-4 py-3 font-semibold">Qty to bake</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr
                    key={`${line.productName}-${line.variantLabel}`}
                    className="border-b border-accent/10 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{line.productName}</td>
                    <td className="px-4 py-3">{line.variantLabel}</td>
                    <td className="px-4 py-3 font-semibold text-accent">
                      {line.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!compact && orders.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Orders ({orders.length})
              </h3>
              <ul className="mt-4 space-y-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-accent/10 px-4 py-3"
                  >
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono font-medium text-accent hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm text-foreground/70">
                        {order.customerName} · {order.itemCount} items
                        {order.deliverySlot
                          ? ` · ${DELIVERY_SLOT_LABELS[order.deliverySlot as DeliverySlot]}`
                          : ""}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-foreground/60">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
