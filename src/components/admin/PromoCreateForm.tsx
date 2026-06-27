"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPromoFromForm } from "@/app/actions/admin";

export function PromoCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await createPromoFromForm(formData);
      if (result.success) {
        setMessage("Promo code created.");
        router.refresh();
      } else {
        setError(result.error ?? "Could not create promo.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border border-accent/15 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
        Create promo code
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className="block text-sm font-medium">
            Code
          </label>
          <input
            id="code"
            name="code"
            required
            placeholder="THETA10"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm uppercase outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="discountType" className="block text-sm font-medium">
            Discount type
          </label>
          <select
            id="discountType"
            name="discountType"
            defaultValue="percent"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="percent">Percent (%)</option>
            <option value="fixed">Fixed amount (₹)</option>
          </select>
        </div>

        <div>
          <label htmlFor="discountValue" className="block text-sm font-medium">
            Discount value
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            min={1}
            required
            placeholder="10"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="minOrder" className="block text-sm font-medium">
            Min order (₹)
          </label>
          <input
            id="minOrder"
            name="minOrder"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="maxUses" className="block text-sm font-medium">
            Max uses{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min={1}
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked
          className="h-4 w-4 rounded border-accent/30"
        />
        <span>Active on storefront</span>
      </label>

      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center rounded-full bg-accent px-8 text-sm font-semibold text-off-white disabled:opacity-60"
      >
        {isPending ? "Creating…" : "Create promo"}
      </button>
    </form>
  );
}
