"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deletePromo, updatePromoActive } from "@/app/actions/admin";
import { formatPrice } from "@/lib/products/formatting";
import type { PromoCodeRow } from "@/lib/supabase/database.types";

type AdminPromoListProps = {
  promos: PromoCodeRow[];
};

export function AdminPromoList({ promos }: AdminPromoListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      await updatePromoActive(id, !isActive);
      router.refresh();
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this promo code?")) return;
    startTransition(async () => {
      await deletePromo(id);
      router.refresh();
    });
  }

  if (promos.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        No promo codes yet. Create one below.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-accent/15">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-accent/15 bg-primary/20">
          <tr>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Discount</th>
            <th className="px-4 py-3 font-semibold">Min order</th>
            <th className="px-4 py-3 font-semibold">Uses</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr
              key={promo.id}
              className="border-b border-accent/10 last:border-0 hover:bg-primary/10"
            >
              <td className="px-4 py-3 font-mono font-semibold">{promo.code}</td>
              <td className="px-4 py-3">
                {promo.discount_type === "percent"
                  ? `${promo.discount_value}%`
                  : formatPrice(promo.discount_value)}
              </td>
              <td className="px-4 py-3">
                {promo.min_order > 0
                  ? formatPrice(promo.min_order)
                  : "—"}
              </td>
              <td className="px-4 py-3">
                {promo.use_count}
                {promo.max_uses != null ? ` / ${promo.max_uses}` : ""}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggleActive(promo.id, promo.is_active)}
                  disabled={isPending}
                  className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-60 ${
                    promo.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-foreground/10 text-foreground/60"
                  }`}
                >
                  {promo.is_active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => remove(promo.id)}
                  disabled={isPending}
                  className="text-sm text-red-600 hover:underline disabled:opacity-60"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
