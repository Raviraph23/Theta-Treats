"use client";

import Image from "next/image";
import { formatPrice } from "@/data/products";
import { SITE } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

function buildWhatsAppMessage(
  items: { name: string; quantity: number; price: number }[],
  total: number,
) {
  const lines = items.map(
    (i) => `• ${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`,
  );
  return encodeURIComponent(
    `Hi ${SITE.name}! I'd like to place an order:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and delivery details. Thank you!`,
  );
}

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

  if (!isOpen) return null;

  const whatsappUrl =
    items.length > 0
      ? `https://wa.me/${SITE.phoneRaw}?text=${buildWhatsAppMessage(
          items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          total,
        )}`
      : "#";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close cart"
      />

      <aside
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
                Add some delicious brownies to get started!
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-foreground"
              >
                Browse Brownies
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-xl border border-accent/10 bg-primary/20 p-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm font-semibold text-accent">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
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
                          updateQuantity(product.id, quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white text-lg font-medium shadow-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="ml-auto text-xs text-foreground/50 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
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

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              <WhatsAppIcon />
              Order on WhatsApp
            </a>

            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full py-2 text-center text-xs text-foreground/50 underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
