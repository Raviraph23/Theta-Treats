"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { OrderStatus, PaymentStatus } from "@/lib/supabase/database.types";
import { ORDER_STATUS_LABELS } from "@/lib/orders/whatsapp";
import { PAYMENT_STATUS_LABELS } from "@/lib/payments/labels";

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "confirmed", label: ORDER_STATUS_LABELS.confirmed },
  { value: "preparing", label: ORDER_STATUS_LABELS.preparing },
  { value: "out_for_delivery", label: ORDER_STATUS_LABELS.out_for_delivery },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

const PAYMENT_OPTIONS: { value: PaymentStatus | "all"; label: string }[] = [
  { value: "all", label: "All payments" },
  { value: "pending", label: PAYMENT_STATUS_LABELS.pending },
  { value: "paid", label: PAYMENT_STATUS_LABELS.paid },
  { value: "cod", label: PAYMENT_STATUS_LABELS.cod },
  { value: "failed", label: PAYMENT_STATUS_LABELS.failed },
];

export function AdminOrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const status = searchParams.get("status") ?? "all";
  const payment = searchParams.get("payment") ?? "all";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.replace(`/admin/orders?${params.toString()}`);
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.replace("/admin/orders");
    });
  }

  const exportHref = `/api/admin/orders/export?${searchParams.toString()}`;

  return (
    <div className="rounded-2xl border border-accent/15 bg-background p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground/70">Status</span>
          <select
            value={status}
            onChange={(e) => updateParams({ status: e.target.value })}
            disabled={isPending}
            className="rounded-xl border border-accent/20 bg-off-white px-3 py-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground/70">Payment</span>
          <select
            value={payment}
            onChange={(e) => updateParams({ payment: e.target.value })}
            disabled={isPending}
            className="rounded-xl border border-accent/20 bg-off-white px-3 py-2"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground/70">From</span>
          <input
            type="date"
            value={from}
            onChange={(e) => updateParams({ from: e.target.value })}
            disabled={isPending}
            className="rounded-xl border border-accent/20 bg-off-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-foreground/70">To</span>
          <input
            type="date"
            value={to}
            onChange={(e) => updateParams({ to: e.target.value })}
            disabled={isPending}
            className="rounded-xl border border-accent/20 bg-off-white px-3 py-2"
          />
        </label>

        <button
          type="button"
          onClick={clearFilters}
          disabled={isPending}
          className="rounded-xl border border-accent/20 px-4 py-2 text-sm text-foreground/70 hover:bg-primary/10 disabled:opacity-60"
        >
          Clear
        </button>

        <Link
          href={exportHref}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Export CSV
        </Link>
      </div>
    </div>
  );
}
