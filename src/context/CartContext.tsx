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
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, variant: ProductVariant) => void;
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
      setIsOpen(true);
    },
    [products],
  );

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
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((o) => !o),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, isOpen, isHydrated, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
