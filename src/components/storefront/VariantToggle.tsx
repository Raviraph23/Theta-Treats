"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  formatVariantLabel,
  getVariantGroupLabel,
  getVariantOptions,
} from "@/lib/products/formatting";
import type { Product, ProductVariant } from "@/types/product";

type VariantToggleProps = {
  product: Product;
  value: ProductVariant;
  onChange: (variant: ProductVariant) => void;
};

export function VariantToggle({ product, value, onChange }: VariantToggleProps) {
  const options = getVariantOptions(product);
  const [enableDesktopHoverFx, setEnableDesktopHoverFx] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (min-width: 768px)");
    const update = () => setEnableDesktopHoverFx(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const pillLayoutId = `variant-pill-${product.id}`;

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
        {getVariantGroupLabel(product)}
      </p>
      <motion.div
        className="relative flex gap-1.5 rounded-full bg-primary/30 p-1"
        role="group"
        aria-label={`Select ${getVariantGroupLabel(product).toLowerCase()}`}
        style={{ transformStyle: "preserve-3d", perspective: 900 }}
        whileHover={
          enableDesktopHoverFx
            ? {
                rotateX: 6,
                rotateY: -4,
                scale: 1.015,
                boxShadow: "0 12px 28px -8px rgba(0,0,0,0.18)",
              }
            : undefined
        }
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {options.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isSelected}
              className="relative flex-1 rounded-full px-2 py-2 text-xs font-semibold"
            >
              {isSelected && (
                <motion.span
                  layoutId={pillLayoutId}
                  className="absolute inset-0 rounded-full bg-foreground shadow-sm"
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 34,
                    mass: 0.85,
                  }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isSelected
                    ? "text-off-white"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {formatVariantLabel(product, option)}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
