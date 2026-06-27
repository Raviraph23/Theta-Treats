import type { OrderStatus } from "@/lib/supabase/database.types";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";

const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

type OrderStatusTimelineProps = {
  status: OrderStatus;
};

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-red-700">Order cancelled</p>
        <p className="mt-1 text-xs text-red-600/80">
          This order is no longer active. Contact us on WhatsApp if you have
          questions.
        </p>
      </div>
    );
  }

  const currentIndex = TIMELINE_STEPS.indexOf(status);

  return (
    <div className="rounded-2xl border border-accent/15 bg-primary/10 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
        Order progress
      </h2>
      <ol className="mt-4 space-y-0">
        {TIMELINE_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
              {index < TIMELINE_STEPS.length - 1 && (
                <span
                  className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${
                    isComplete ? "bg-accent" : "bg-accent/20"
                  }`}
                  aria-hidden
                />
              )}

              <span
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isComplete
                    ? "bg-accent text-off-white"
                    : isCurrent
                      ? "bg-accent text-off-white ring-4 ring-accent/20"
                      : "border-2 border-accent/25 bg-off-white text-foreground/40"
                }`}
                aria-hidden
              >
                {isComplete ? "✓" : index + 1}
              </span>

              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-medium ${
                    isUpcoming ? "text-foreground/45" : "text-foreground"
                  }`}
                >
                  {ORDER_STATUS_LABELS[step]}
                </p>
                {isCurrent && (
                  <p className="mt-0.5 text-xs text-accent">Current status</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
