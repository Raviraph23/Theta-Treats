"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import {
  ADMIN_STATUS_OPTIONS,
  ORDER_STATUS_LABELS,
} from "@/lib/orders/whatsapp";
import type { OrderStatus } from "@/lib/supabase/database.types";

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, status);
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-accent/20 bg-off-white px-3 py-2 text-sm outline-none focus:border-accent disabled:opacity-60"
    >
      {ADMIN_STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {ORDER_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
