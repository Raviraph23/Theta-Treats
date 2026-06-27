"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/products/formatting";
import { completeMockPayment } from "@/app/actions/payments";
import {
  MOCK_PAYMENT_OPTIONS,
  type MockPaymentMethod,
} from "@/lib/payments/labels";

type MockPaymentFormProps = {
  orderNumber: string;
  total: number;
};

export function MockPaymentForm({ orderNumber, total }: MockPaymentFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<MockPaymentMethod>("mock_upi");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await completeMockPayment(orderNumber, method);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/order/${result.orderNumber}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Demo mode:</strong> No real money is charged. This simulates
        payment for testing only.
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold uppercase tracking-wide text-accent">
          Payment method
        </legend>
        {MOCK_PAYMENT_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              method === option.value
                ? "border-accent bg-primary/20"
                : "border-accent/15 hover:border-accent/30"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.value}
              checked={method === option.value}
              onChange={() => setMethod(option.value)}
              className="mt-1 h-4 w-4 border-accent/30"
            />
            <span>
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="block text-xs text-foreground/60">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {method === "mock_card" && (
        <div className="space-y-3 rounded-xl border border-accent/15 bg-off-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            Demo card details
          </p>
          <input
            readOnly
            value="4111 1111 1111 1111"
            className="w-full rounded-lg border border-accent/20 bg-white px-3 py-2 text-sm text-foreground/70"
            aria-label="Demo card number"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              readOnly
              value="12/28"
              className="rounded-lg border border-accent/20 bg-white px-3 py-2 text-sm text-foreground/70"
              aria-label="Demo expiry"
            />
            <input
              readOnly
              value="123"
              className="rounded-lg border border-accent/20 bg-white px-3 py-2 text-sm text-foreground/70"
              aria-label="Demo CVV"
            />
          </div>
        </div>
      )}

      {method === "mock_upi" && (
        <div className="rounded-xl border border-accent/15 bg-off-white p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            Demo UPI ID
          </p>
          <p className="mt-2 font-mono text-sm text-foreground/80">
            thetatreats@upi
          </p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-accent/15 bg-primary/20 px-4 py-3">
        <span className="font-medium">Amount to pay</span>
        <span className="text-xl font-bold text-accent">
          {method === "cod" ? "Pay on delivery" : formatPrice(total)}
        </span>
      </div>
      {method === "cod" && (
        <p className="text-center text-xs text-foreground/60">
          Pay {formatPrice(total)} in cash when your order is delivered.
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
        className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {isPending
          ? "Processing…"
          : method === "cod"
            ? "Confirm order (COD)"
            : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  );
}
