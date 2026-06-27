"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductPrice } from "@/lib/products/formatting";
import type { Product, ProductVariant } from "@/types/product";
import { isProductSoldOut } from "@/lib/commerce/stock";
import {
  loadCartFromStorage,
  saveCartToStorage,
} from "@/lib/orders/cart-storage";

export type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  isHydrated: boolean;
  toastMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearToast: () => void;
  addItem: (productId: string, variant: ProductVariant) => void;
  addBundleItems: (
    items: { productId: string; variant: ProductVariant }[],
    label: string,
  ) => void;
  removeItem: (productId: string, variant: ProductVariant) => void;
  updateQuantity: (
    productId: string,
    variant: ProductVariant,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function matchesCartItem(
  item: CartItem,
  productId: string,
  variant: ProductVariant,
) {
  return item.product.id === productId && item.variant === variant;
}

function hydrateCartItems(
  stored: ReturnType<typeof loadCartFromStorage>,
  catalog: Product[],
): CartItem[] {
  return stored
    .map((storedItem) => {
      const product = catalog.find((p) => p.id === storedItem.productId);
      if (!product || product.isActive === false) return null;
      if (isProductSoldOut(product, 0)) return null;
      return {
        product,
        variant: storedItem.variant as ProductVariant,
        quantity: storedItem.quantity,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

type CartProviderProps = {
  children: ReactNode;
  products: Product[];
};

export function CartProvider({ children, products }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored.length > 0) {
      setItems(hydrateCartItems(stored, products));
    }
    setIsHydrated(true);
  }, [products]);

  useEffect(() => {
    if (!isHydrated) return;
    saveCartToStorage(
      items.map((i) => ({
        productId: i.product.id,
        variant: i.variant,
        quantity: i.quantity,
      })),
    );
  }, [items, isHydrated]);

  const addItem = useCallback(
    (productId: string, variant: ProductVariant) => {
      const product = products.find((p) => p.id === productId);
      if (!product || product.isActive === false) return;
      if (isProductSoldOut(product, 0)) return;

      setItems((prev) => {
        const existing = prev.find((i) =>
          matchesCartItem(i, productId, variant),
        );
        if (existing) {
          return prev.map((i) =>
            matchesCartItem(i, productId, variant)
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [...prev, { product, variant, quantity: 1 }];
      });
      setToastMessage(product.name);
      setIsOpen(true);
    },
    [products],
  );

  const addBundleItems = useCallback(
    (
      bundleItems: { productId: string; variant: ProductVariant }[],
      label: string,
    ) => {
      const additions: CartItem[] = [];

      for (const item of bundleItems) {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.isActive === false) return;
        if (isProductSoldOut(product, 0)) return;
        additions.push({ product, variant: item.variant, quantity: 1 });
      }

      if (additions.length === 0) return;

      setItems((prev) => {
        const next = [...prev];
        for (const addition of additions) {
          const existing = next.find((i) =>
            matchesCartItem(i, addition.product.id, addition.variant),
          );
          if (existing) {
            existing.quantity += 1;
          } else {
            next.push(addition);
          }
        }
        return next;
      });
      setToastMessage(label);
      setIsOpen(true);
    },
    [products],
  );

  const clearToast = useCallback(() => setToastMessage(null), []);

  const removeItem = useCallback(
    (productId: string, variant: ProductVariant) => {
      setItems((prev) =>
        prev.filter((i) => !matchesCartItem(i, productId, variant)),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, variant: ProductVariant, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => !matchesCartItem(i, productId, variant)),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          matchesCartItem(i, productId, variant) ? { ...i, quantity } : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce(
      (sum, i) => sum + getProductPrice(i.product, i.variant) * i.quantity,
      0,
    );

    return {
      items,
      itemCount,
      total,
      isOpen,
      isHydrated,
      toastMessage,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      clearToast,
      addItem,
      addBundleItems,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, isOpen, isHydrated, toastMessage, addItem, addBundleItems, removeItem, updateQuantity, clearCart, clearToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
