"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function CartToast() {
  const { toastMessage, clearToast } = useCart();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="fixed bottom-24 left-1/2 z-[60] w-[min(92vw,320px)] -translate-x-1/2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-accent/20 bg-foreground px-4 py-3 text-off-white shadow-xl">
            <span className="text-lg" aria-hidden>
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{toastMessage}</p>
              <p className="text-xs text-off-white/70">Added to cart</p>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="shrink-0 text-off-white/60 transition hover:text-off-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
