"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getCheckoutPreview,
  validatePromoCode,
} from "@/app/actions/commerce";
import { formatPrice } from "@/lib/products/formatting";
import type { StoreSettings } from "@/lib/commerce/constants";
import { formatDeliveryFeeMessage } from "@/lib/commerce/delivery";
import type { CartLineInput } from "@/lib/orders/validation";

type CheckoutOrderSummaryProps = {
  cartItems: CartLineInput[];
  deliveryAddress: string;
  settings: StoreSettings;
  onPromoCodeChange: (code: string | null) => void;
};

export function CheckoutOrderSummary({
  cartItems,
  deliveryAddress,
  settings,
  onPromoCodeChange,
}: CheckoutOrderSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof getCheckoutPreview>
  > | null>(null);
  const [isApplying, startApply] = useTransition();
  const [isLoading, startPreview] = useTransition();

  useEffect(() => {
    if (cartItems.length === 0) return;

    startPreview(async () => {
      const result = await getCheckoutPreview({
        items: cartItems,
        deliveryAddress,
        promoCode: appliedPromo ?? undefined,
      });
      setPreview(result);
    });
  }, [cartItems, deliveryAddress, appliedPromo]);

  function handleApplyPromo() {
    setPromoError(null);
    const subtotal =
      preview?.success === true ? preview.subtotal : 0;

    startApply(async () => {
      const result = await validatePromoCode(promoInput, subtotal);
      if (!result.success) {
        setPromoError(result.error);
        setAppliedPromo(null);
        onPromoCodeChange(null);
        return;
      }
      setAppliedPromo(result.code);
      onPromoCodeChange(result.code);
      setPromoInput(result.code);
    });
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
    onPromoCodeChange(null);
  }

  if (!preview?.success) {
    return (
      <div className="mt-6 rounded-2xl border border-accent/15 bg-primary/20 p-4">
        <p className="text-sm text-foreground/60">Calculating totals…</p>
      </div>
    );
  }

  const belowMin = !preview.meetsMinOrder;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-accent/15 bg-primary/20 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          Order total
        </h2>

        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-foreground/70">Subtotal</dt>
            <dd className="font-medium">{formatPrice(preview.subtotal)}</dd>
          </div>

          {preview.discountAmount > 0 && (
            <div className="flex justify-between text-green-700">
              <dt>
                Discount
                {preview.promoCode ? ` (${preview.promoCode})` : ""}
              </dt>
              <dd className="font-medium">
                −{formatPrice(preview.discountAmount)}
              </dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="text-foreground/70">
              Delivery
              {preview.deliveryZoneLabel
                ? ` · ${preview.deliveryZoneLabel}`
                : ""}
            </dt>
            <dd className="font-medium">
              {preview.freeDelivery || preview.deliveryFee === 0
                ? "Free"
                : formatPrice(preview.deliveryFee)}
            </dd>
          </div>

          <div className="flex justify-between border-t border-accent/15 pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="text-xl font-bold text-accent">
              {formatPrice(preview.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-foreground/60">
          {formatDeliveryFeeMessage(settings)}
        </p>
      </div>

      <div className="rounded-2xl border border-accent/15 p-4">
        <label htmlFor="promoCode" className="block text-sm font-medium">
          Promo code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="promoCode"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            disabled={!!appliedPromo}
            placeholder="e.g. THETA10"
            className="min-w-0 flex-1 rounded-xl border border-accent/20 bg-off-white px-4 py-2.5 text-sm uppercase outline-none focus:border-accent disabled:opacity-60"
          />
          {appliedPromo ? (
            <button
              type="button"
              onClick={handleRemovePromo}
              className="shrink-0 rounded-full border border-accent/30 px-4 py-2.5 text-sm font-medium text-foreground/70"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isApplying || !promoInput.trim()}
              className="shrink-0 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-off-white disabled:opacity-60"
            >
              {isApplying ? "…" : "Apply"}
            </button>
          )}
        </div>
        {promoError && (
          <p className="mt-2 text-xs text-red-600">{promoError}</p>
        )}
        {appliedPromo && !promoError && (
          <p className="mt-2 text-xs text-green-700">
            Promo code applied successfully.
          </p>
        )}
      </div>

      {belowMin && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Minimum order is {formatPrice(preview.minOrderAmount)}. Add{" "}
          {formatPrice(preview.minOrderAmount - preview.subtotal)} more to
          checkout.
        </p>
      )}

      {(isLoading || isApplying) && (
        <p className="sr-only" aria-live="polite">
          Updating totals…
        </p>
      )}
    </div>
  );
}

export function useCheckoutBlocked(
  cartItems: CartLineInput[],
  deliveryAddress: string,
  appliedPromo: string | null,
): boolean {
  const [blocked, setBlocked] = useState(true);

  useEffect(() => {
    if (cartItems.length === 0) {
      setBlocked(true);
      return;
    }

    getCheckoutPreview({
      items: cartItems,
      deliveryAddress,
      promoCode: appliedPromo ?? undefined,
    }).then((result) => {
      setBlocked(!result.success || !result.meetsMinOrder);
    });
  }, [cartItems, deliveryAddress, appliedPromo]);

  return blocked;
}
