import type { PaymentStatus } from "@/lib/supabase/database.types";
import { PAYMENT_STATUS_LABELS } from "@/lib/payments/labels";

const STATUS_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cod: "bg-blue-100 text-blue-800",
};

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}
