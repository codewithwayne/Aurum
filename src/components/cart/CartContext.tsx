"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  priceKes: number;
  quantity: number;
  stock: number;
  image?: string | null; // <-- ADDED
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    const saved = localStorage.getItem("aurum-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("aurum-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === newItem.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
    openCart();
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.priceKes * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, addItem, removeItem, updateQuantity, clearCart, 
        totalItems, subtotal, isCartOpen, openCart, closeCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}