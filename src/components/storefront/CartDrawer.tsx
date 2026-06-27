"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  formatPrice,
  formatVariantLabel,
  getProductPrice,
} from "@/lib/products/formatting";
import { productImageProps } from "@/lib/products/image-props";
import { useCart } from "@/context/CartContext";
import { saveCartToStorage } from "@/lib/orders/cart-storage";

export function CartDrawer() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  function handleProceedToCheckout() {
    saveCartToStorage(
      items.map((i) => ({
        productId: i.product.id,
        variant: i.variant,
        quantity: i.quantity,
      })),
    );
    closeCart();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            onClick={closeCart}
            aria-label="Close cart"
          />

          <motion.aside
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-off-white shadow-2xl sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:max-h-[calc(100vh-2rem)] sm:w-[400px] sm:rounded-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-accent/15 px-5 py-4">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Your Cart
                {itemCount > 0 && (
                  <span className="ml-2 text-base font-normal text-accent">
                    ({itemCount})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/60 transition hover:bg-primary/40"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="text-4xl" aria-hidden>
                    🧺
                  </span>
                  <p className="mt-3 font-display text-lg text-foreground">
                    Your cart is empty
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    Add some delicious treats to get started!
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-foreground"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, variant, quantity }) => {
                    const price = getProductPrice(product, variant);
                    const lineKey = `${product.id}-${variant}`;

                    return (
                      <motion.li
                        key={lineKey}
                        layout
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="flex gap-3 rounded-xl border border-accent/10 bg-primary/20 p-3"
                      >
                        <Image
                          key={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          {...productImageProps(product.image)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {formatVariantLabel(product, variant)}
                          </p>
                          <p className="text-sm font-semibold text-accent">
                            {formatPrice(price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, variant, quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white text-lg font-medium shadow-sm"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(product.id, variant, quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white text-lg font-medium shadow-sm"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id, variant)}
                              className="ml-auto text-xs text-foreground/50 underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-accent/15 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-foreground/70">Total</span>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={handleProceedToCheckout}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-off-white transition active:scale-[0.98]"
                >
                  Proceed to checkout
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-2 w-full py-2 text-center text-xs text-foreground/50 underline"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
