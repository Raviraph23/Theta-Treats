"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  formatPrice,
  formatVariantLabel,
  getProductPrice,
} from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import type { Product, ProductVariant } from "@/types/product";
import { createOrder } from "@/app/actions/orders";
import { DeliverySlotPicker } from "@/components/DeliverySlotPicker";
import {
  CheckoutOrderSummary,
  useCheckoutBlocked,
} from "@/components/CheckoutOrderSummary";
import { useCart } from "@/context/CartContext";
import { OCCASION_OPTIONS } from "@/lib/orders/delivery-slots";
import type { StoreSettings } from "@/lib/commerce/constants";
import {
  clearCartStorage,
  loadCartFromStorage,
} from "@/lib/orders/cart-storage";

type CheckoutFormProps = {
  products: Product[];
  settings: StoreSettings;
};

export function CheckoutForm({ products, settings }: CheckoutFormProps) {
  const router = useRouter();
  const { items, clearCart, isHydrated } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  const displayItems =
    items.length > 0
      ? items
      : loadCartFromStorage()
          .map((stored) => {
            const product = products.find((p) => p.id === stored.productId);
            if (!product) return null;
            return {
              product,
              variant: stored.variant as ProductVariant,
              quantity: stored.quantity,
            };
          })
          .filter(Boolean) as {
          product: Product;
          variant: ProductVariant;
          quantity: number;
        }[];

  const cartItems = useMemo(
    () =>
      displayItems.map((i) => ({
        productId: i.product.id,
        variant: i.variant,
        quantity: i.quantity,
      })),
    [displayItems],
  );

  const checkoutBlocked = useCheckoutBlocked(
    cartItems,
    deliveryAddress,
    appliedPromoCode,
  );

  useEffect(() => {
    if (!isHydrated || orderPlaced) return;
    if (displayItems.length === 0) {
      router.replace("/");
    }
  }, [isHydrated, displayItems.length, orderPlaced, router]);

  function handleSubmit(formData: FormData) {
    setError(null);

    const submitItems =
      items.length > 0
        ? items.map((i) => ({
            productId: i.product.id,
            variant: i.variant,
            quantity: i.quantity,
          }))
        : loadCartFromStorage();

    startTransition(async () => {
      const result = await createOrder({
        customerName: formData.get("customerName")?.toString() ?? "",
        customerPhone: formData.get("customerPhone")?.toString() ?? "",
        deliveryAddress: formData.get("deliveryAddress")?.toString() ?? "",
        deliveryDate: formData.get("deliveryDate")?.toString() ?? "",
        deliverySlot: formData.get("deliverySlot")?.toString() ?? "",
        notes: formData.get("notes")?.toString() ?? "",
        giftMessage: formData.get("giftMessage")?.toString() ?? "",
        occasion: formData.get("occasion")?.toString() ?? "",
        promoCode: appliedPromoCode ?? undefined,
        whatsappConsent: formData.get("whatsappConsent") === "on",
        items: submitItems,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setOrderPlaced(true);
      clearCart();
      clearCartStorage();
      router.push(`/order/${result.orderNumber}/pay`);
    });
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-foreground/60">Redirecting to payment…</p>
      </div>
    );
  }

  if (!isHydrated || displayItems.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-foreground/60">Loading checkout…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link
        href="/"
        className="text-sm text-accent underline-offset-2 hover:underline"
      >
        ← Back to menu
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        Enter your details and proceed to payment to complete your order.
      </p>

      <div className="mt-6 rounded-2xl border border-accent/15 bg-primary/20 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          Items
        </h2>
        <ul className="mt-3 space-y-3">
          {displayItems.map(({ product, variant, quantity }) => (
            <li
              key={`${product.id}-${variant}`}
              className="flex items-center gap-3"
            >
              <Image
                key={product.image}
                alt={product.name}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                {...productImageProps(product.image)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-foreground/60">
                  {formatVariantLabel(product, variant)} × {quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-accent">
                {formatPrice(getProductPrice(product, variant) * quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <form action={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium">
            Full name
          </label>
          <input
            id="customerName"
            name="customerName"
            required
            autoComplete="name"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium">
            WhatsApp number
          </label>
          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            required
            autoComplete="tel"
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="10-digit mobile number"
          />
        </div>

        <div>
          <label
            htmlFor="deliveryAddress"
            className="block text-sm font-medium"
          >
            Delivery address
          </label>
          <textarea
            id="deliveryAddress"
            name="deliveryAddress"
            required
            rows={3}
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="mt-1 w-full resize-none rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="Area, street, landmark, pincode"
          />
          <p className="mt-1 text-xs text-foreground/50">
            Include your 6-digit pincode for accurate delivery fee.
          </p>
        </div>

        <CheckoutOrderSummary
          cartItems={cartItems}
          deliveryAddress={deliveryAddress}
          settings={settings}
          onPromoCodeChange={setAppliedPromoCode}
        />

        <DeliverySlotPicker />

        <div>
          <label htmlFor="occasion" className="block text-sm font-medium">
            Occasion{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <select
            id="occasion"
            name="occasion"
            defaultValue=""
            className="mt-1 w-full rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
          >
            {OCCASION_OPTIONS.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="giftMessage" className="block text-sm font-medium">
            Gift message{" "}
            <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <textarea
            id="giftMessage"
            name="giftMessage"
            rows={2}
            maxLength={300}
            className="mt-1 w-full resize-none rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="A short note to include with the gift"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes <span className="font-normal text-foreground/50">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="mt-1 w-full resize-none rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="Allergies, delivery instructions, etc."
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-foreground/80">
          <input
            type="checkbox"
            name="whatsappConsent"
            required
            defaultChecked
            className="mt-1 h-4 w-4 rounded border-accent/30"
          />
          <span>
            I agree to be contacted on WhatsApp about this order.
          </span>
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || checkoutBlocked}
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Placing order…" : "Continue to payment"}
        </button>
      </form>
    </div>
  );
}
