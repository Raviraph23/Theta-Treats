"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveCartToStorage } from "@/lib/orders/cart-storage";
import type { OrderItem } from "@/lib/supabase/database.types";

type ReorderButtonProps = {
  items: Pick<OrderItem, "product_id" | "variant" | "quantity">[];
  className?: string;
};

export function ReorderButton({ items, className }: ReorderButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleReorder() {
    setIsLoading(true);
    saveCartToStorage(
      items.map((item) => ({
        productId: item.product_id,
        variant: item.variant,
        quantity: item.quantity,
      })),
    );
    router.push("/checkout");
  }

  return (
    <button
      type="button"
      onClick={handleReorder}
      disabled={isLoading}
      className={
        className ??
        "flex h-12 w-full items-center justify-center rounded-full border-2 border-accent bg-off-white text-sm font-semibold text-accent transition active:scale-[0.98] disabled:opacity-60"
      }
    >
      {isLoading ? "Loading cart…" : "Reorder"}
    </button>
  );
}
