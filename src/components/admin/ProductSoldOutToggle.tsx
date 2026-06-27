"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateProductSoldOut } from "@/app/actions/admin";

type ProductSoldOutToggleProps = {
  productId: string;
  isSoldOut: boolean;
};

export function ProductSoldOutToggle({
  productId,
  isSoldOut,
}: ProductSoldOutToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await updateProductSoldOut(productId, !isSoldOut);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-60 ${
        isSoldOut
          ? "bg-red-100 text-red-800"
          : "bg-foreground/10 text-foreground/60"
      }`}
    >
      {isPending ? "…" : isSoldOut ? "Sold out" : "In stock"}
    </button>
  );
}
