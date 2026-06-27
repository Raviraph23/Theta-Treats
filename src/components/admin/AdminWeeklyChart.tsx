import { formatPrice } from "@/lib/products/formatting";
import type { DailyMetric } from "@/lib/admin/stats";

type AdminWeeklyChartProps = {
  metrics: DailyMetric[];
};

export function AdminWeeklyChart({ metrics }: AdminWeeklyChartProps) {
  const maxOrders = Math.max(...metrics.map((day) => day.orders), 1);
  const maxRevenue = Math.max(...metrics.map((day) => day.revenue), 1);
  const totalOrders = metrics.reduce((sum, day) => sum + day.orders, 0);
  const totalRevenue = metrics.reduce((sum, day) => sum + day.revenue, 0);

  return (
    <div className="rounded-2xl border border-accent/15 bg-background p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Last 7 days
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            {totalOrders} orders · {formatPrice(totalRevenue)} revenue
          </p>
        </div>
        <div className="flex gap-4 text-xs text-foreground/60">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            Orders
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            Revenue
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-2 sm:gap-3">
        {metrics.map((day) => {
          const orderHeight = Math.round((day.orders / maxOrders) * 100);
          const revenueHeight = Math.round((day.revenue / maxRevenue) * 100);

          return (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end justify-center gap-1">
                <div
                  className="w-3 rounded-t bg-accent/90 sm:w-4"
                  style={{ height: `${Math.max(orderHeight, day.orders > 0 ? 8 : 0)}%` }}
                  title={`${day.orders} orders`}
                />
                <div
                  className="w-3 rounded-t bg-primary sm:w-4"
                  style={{
                    height: `${Math.max(revenueHeight, day.revenue > 0 ? 8 : 0)}%`,
                  }}
                  title={formatPrice(day.revenue)}
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-foreground/70 sm:text-xs">
                  {day.label}
                </p>
                <p className="text-[10px] text-foreground/50">{day.orders}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
