"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateProductActive } from "@/app/actions/admin";

type ProductAvailabilityToggleProps = {
  productId: string;
  isActive: boolean;
};

export function ProductAvailabilityToggle({
  productId,
  isActive,
}: ProductAvailabilityToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await updateProductActive(productId, !isActive);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-60 ${
        isActive
          ? "bg-green-100 text-green-800"
          : "bg-foreground/10 text-foreground/60"
      }`}
    >
      {isPending ? "…" : isActive ? "Available" : "Hidden"}
    </button>
  );
}
