"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeMockPayment } from "@/app/actions/payments";
import { formatPrice } from "@/lib/products/formatting";
import {
  MOCK_PAYMENT_OPTIONS,
  type MockPaymentMethod,
} from "@/lib/payments/labels";
import { isPortfolioDemoMode } from "@/lib/payments/portfolio-mode";

export type PaymentLineItem = {
  name: string;
  quantity: number;
  lineTotal: number;
};

type MockPaymentFormProps = {
  orderNumber: string;
  total: number;
  customerName: string;
  items: PaymentLineItem[];
};

const UPI_APPS = [
  { name: "Google Pay", color: "bg-white" },
  { name: "PhonePe", color: "bg-[#5f259f]/10" },
  { name: "Paytm", color: "bg-[#00baf2]/10" },
] as const;

const UPI_PROCESSING_MS = 2200;
const CARD_PROCESSING_MS = 1500;

export function MockPaymentForm({
  orderNumber,
  total,
  customerName,
  items,
}: MockPaymentFormProps) {
  const router = useRouter();
  const [method, setMethod] = useState<MockPaymentMethod>("mock_upi");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const showDemoBanner = isPortfolioDemoMode();
  const busy = isPending || isProcessing;

  async function processPayment(selectedMethod: MockPaymentMethod) {
    setError(null);
    setIsProcessing(true);

    const delay =
      selectedMethod === "mock_upi"
        ? UPI_PROCESSING_MS
        : selectedMethod === "mock_card"
          ? CARD_PROCESSING_MS
          : 0;

    if (delay > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }

    startTransition(async () => {
      const result = await completeMockPayment(orderNumber, selectedMethod);
      setIsProcessing(false);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/order/${result.orderNumber}`);
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    void processPayment(method);
  }

  if (isProcessing && method === "mock_upi") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/15 bg-off-white px-6 py-16 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent"
          role="status"
          aria-label="Processing payment"
        />
        <p className="mt-6 font-medium text-foreground">
          Waiting for approval on your UPI app…
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Approve the request in Google Pay, PhonePe, or Paytm to continue.
        </p>
        <p className="mt-6 font-mono text-xs text-foreground/50">
          thetatreats@upi · {formatPrice(total)}
        </p>
      </div>
    );
  }

  if (isProcessing && method === "mock_card") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/15 bg-off-white px-6 py-16 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent"
          role="status"
          aria-label="Processing payment"
        />
        <p className="mt-6 font-medium text-foreground">Processing card payment…</p>
        <p className="mt-2 text-sm text-foreground/60">
          Verifying with your bank — demo mode only.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showDemoBanner && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Demo mode:</strong> No real money is charged. Payment UI is
          production-ready — swap in Razorpay keys at go-live.
        </div>
      )}

      <div className="lg:hidden rounded-2xl border border-accent/15 bg-primary/15 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          Order summary
        </p>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={`${item.name}-${item.quantity}`}
              className="flex justify-between gap-3 text-sm"
            >
              <span className="text-foreground/80">
                {item.name} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium">
                {formatPrice(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-accent/15 pt-3 font-semibold">
          <span>Total</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
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
                ? "border-accent bg-primary/20 ring-1 ring-accent/30"
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

      {method === "mock_upi" && (
        <div className="space-y-4 rounded-xl border border-accent/15 bg-off-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            Pay via UPI
          </p>
          <div className="flex flex-wrap gap-2">
            {UPI_APPS.map((app) => (
              <span
                key={app.name}
                className={`rounded-lg px-3 py-2 text-xs font-medium text-foreground/80 ${app.color} ring-1 ring-accent/10`}
              >
                {app.name}
              </span>
            ))}
          </div>
          <div className="rounded-lg bg-background px-4 py-3 text-center">
            <p className="text-xs text-foreground/50">UPI ID</p>
            <p className="mt-1 font-mono text-sm font-medium text-foreground">
              thetatreats@upi
            </p>
          </div>
        </div>
      )}

      {method === "mock_card" && (
        <div className="space-y-3 rounded-xl border border-accent/15 bg-off-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            Card details
          </p>
          <input
            readOnly
            value="4111 1111 1111 1111"
            className="w-full rounded-lg border border-accent/20 bg-white px-3 py-2.5 text-sm text-foreground/70"
            aria-label="Demo card number"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              readOnly
              value="12/28"
              className="rounded-lg border border-accent/20 bg-white px-3 py-2.5 text-sm text-foreground/70"
              aria-label="Demo expiry"
            />
            <input
              readOnly
              value="123"
              className="rounded-lg border border-accent/20 bg-white px-3 py-2.5 text-sm text-foreground/70"
              aria-label="Demo CVV"
            />
          </div>
          <p className="text-xs text-foreground/50">
            Secured by Razorpay-style checkout (demo)
          </p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-accent/15 bg-primary/20 px-4 py-3">
        <div>
          <span className="block text-sm font-medium">Amount to pay</span>
          <span className="text-xs text-foreground/60">{customerName}</span>
        </div>
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
        disabled={busy}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-off-white shadow-sm transition hover:bg-accent/90 active:scale-[0.99] disabled:opacity-60"
      >
        {busy
          ? "Processing…"
          : method === "cod"
            ? "Confirm order (COD)"
            : `Pay ${formatPrice(total)}`}
      </button>

      <p className="text-center text-xs text-foreground/45">
        By continuing, you agree to our delivery and refund policies.
      </p>
    </form>
  );
}
