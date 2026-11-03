"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

type Variant = {
  id: string;
  size: string;
  priceKes: number;
  stock: number;
  sku: string;
  image: string | null;
};

type Product = {
  id: string;
  slug: string;
  name: string;
};

export function ProductBuyBox({ 
  variants, 
  product,
  selectedVariant,
  setSelectedVariant 
}: { 
  variants: Variant[]; 
  product: Product;
  selectedVariant: Variant | null;
  setSelectedVariant: (v: Variant) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  if (!selectedVariant) return <p className="mt-6 text-red-500">Out of stock</p>;

  const isOutOfStock = selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: selectedVariant.size,
      priceKes: selectedVariant.priceKes,
      quantity: quantity,
      stock: selectedVariant.stock,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mt-10">
      <p className="text-2xl font-medium">KSh {selectedVariant.priceKes.toLocaleString()}</p>

      <div className="mt-8">
        <p className="text-sm font-medium mb-3">Select Size</p>
        <div className="flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVariant(v);
                setQuantity(1);
              }}
              className={`flex-1 border py-3 text-sm transition-colors ${
                selectedVariant.id === v.id
                  ? "border-[#1a3a2e] bg-[#1a3a2e] text-[#f9f6ef]"
                  : "border-[#1a3a2e]/20 text-[#1a3a2e] hover:border-[#1a3a2e]"
              } ${v.stock <= 0 ? "opacity-50 cursor-not-allowed line-through" : ""}`}
              disabled={v.stock <= 0}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <div className="flex items-center border border-[#1a3a2e]/20">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-[#e8e2d5]">-</button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))} className="px-4 py-3 hover:bg-[#e8e2d5]">+</button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdded}
          className={`flex-1 py-3 text-sm uppercase tracking-widest transition-all ${
            isAdded ? "bg-green-800 text-white" : "bg-[#1a3a2e] text-[#f9f6ef] hover:opacity-90 disabled:opacity-50"
          }`}
        >
          {isOutOfStock ? "Sold Out" : isAdded ? "Added to Bag ✓" : "Add to Cart"}
        </button>
      </div>
      
      <div className="mt-8 space-y-2 text-xs text-[#1a3a2e]/60">
        <p>✓ Delivery across Kenya in 2-4 days</p>
        <p>✓ 100% authentic fragrance oils</p>
      </div>
    </div>
  );
}