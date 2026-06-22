"use client";

import { ProductImage } from "@/components/ProductImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  formatPrice,
  formatVariantLabel,
  getProductPrice,
  type Product,
  type ProductVariant,
} from "@/data/products";
import { createOrder } from "@/app/actions/orders";
import { useCart } from "@/context/CartContext";
import {
  clearCartStorage,
  loadCartFromStorage,
} from "@/lib/orders/cart-storage";

type CheckoutFormProps = {
  products: Product[];
};

export function CheckoutForm({ products }: CheckoutFormProps) {
  const router = useRouter();
  const { items, total, clearCart, isHydrated } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const displayTotal =
    items.length > 0
      ? total
      : displayItems.reduce(
          (sum, i) =>
            sum + getProductPrice(i.product, i.variant) * i.quantity,
          0,
        );

  useEffect(() => {
    if (!isHydrated || orderPlaced) return;
    if (displayItems.length === 0) {
      router.replace("/");
    }
  }, [isHydrated, displayItems.length, orderPlaced, router]);

  function handleSubmit(formData: FormData) {
    setError(null);

    const cartItems =
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
        notes: formData.get("notes")?.toString() ?? "",
        whatsappConsent: formData.get("whatsappConsent") === "on",
        items: cartItems,
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
          Order summary
        </h2>
        <ul className="mt-3 space-y-3">
          {displayItems.map(({ product, variant, quantity }) => (
            <li
              key={`${product.id}-${variant}`}
              className="flex items-center gap-3"
            >
              <ProductImage
                key={product.image}
                src={product.image}
                alt={product.name}
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
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
        <div className="mt-4 flex justify-between border-t border-accent/15 pt-3">
          <span className="font-medium">Total</span>
          <span className="text-xl font-bold text-accent">
            {formatPrice(displayTotal)}
          </span>
        </div>
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
            className="mt-1 w-full resize-none rounded-xl border border-accent/20 bg-off-white px-4 py-3 text-sm outline-none focus:border-accent"
            placeholder="Area, street, landmark, pincode"
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
            placeholder="Delivery time preference, allergies, etc."
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
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? "Placing order…" : "Continue to payment"}
        </button>
      </form>
    </div>
  );
}
