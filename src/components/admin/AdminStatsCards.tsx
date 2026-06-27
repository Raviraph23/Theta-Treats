import { formatPrice } from "@/lib/products/formatting";
import type { DashboardStats } from "@/lib/admin/stats";

type AdminStatsCardsProps = {
  stats: DashboardStats;
};

const cards: {
  key: keyof DashboardStats;
  label: string;
  format: (value: number) => string;
}[] = [
  { key: "ordersToday", label: "Orders today", format: (v) => String(v) },
  { key: "revenueToday", label: "Revenue today", format: formatPrice },
  { key: "pendingOrders", label: "Pending orders", format: (v) => String(v) },
  { key: "deliveredToday", label: "Delivered today", format: (v) => String(v) },
];

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, format }) => (
        <div
          key={key}
          className="rounded-2xl border border-accent/15 bg-background p-5 shadow-sm"
        >
          <p className="text-sm text-foreground/60">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">
            {format(stats[key])}
          </p>
        </div>
      ))}
    </div>
  );
}
