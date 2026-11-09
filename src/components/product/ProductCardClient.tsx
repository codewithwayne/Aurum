"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

type Variant = {
  id: string;
  size: string;
  priceKes: number;
  stock: number;
  sku: string;
  image: string | null;
};

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string | null;
    shortDescription: string;
    isBestseller: boolean;
    isNewArrival: boolean;
    images: string[];
  };
  variants: Variant[];
};

export function ProductCardClient({ product, variants }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;

    const imageToUse = selectedVariant.image || product.images?.[0] || null;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: selectedVariant.size,
      priceKes: selectedVariant.priceKes,
      quantity: 1,
      stock: selectedVariant.stock,
      image: imageToUse, // <-- ADDED
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const primaryImage = product.images?.[0];

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e8e2d5]">
        {product.isBestseller && (
          <span className="absolute left-3 top-3 z-10 bg-[#1a3a2e] px-3 py-1 text-[10px] uppercase tracking-widest text-[#d4a84b]">
            Bestseller
          </span>
        )}
        {product.isNewArrival && !product.isBestseller && (
          <span className="absolute left-3 top-3 z-10 bg-[#1a3a2e] px-3 py-1 text-[10px] uppercase tracking-widest text-[#d4a84b]">
            New
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </Link>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.brand && (
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#1a3a2e]/50">
                {product.brand}
              </p>
            )}
            <h2 className="mt-1 font-serif text-xl text-[#1a3a2e]">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h2>
          </div>
        </div>

        <p className="mt-2 text-sm text-[#1a3a2e]/70 line-clamp-1">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    selectedVariant?.id === v.id
                      ? "bg-[#1a3a2e] text-[#f9f6ef]"
                      : "border border-[#1a3a2e]/20 text-[#1a3a2e] hover:border-[#1a3a2e]"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className="text-sm font-medium">
                KSh {selectedVariant.priceKes.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0 || isAdded}
            className={`mt-4 w-full border py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50 ${
              isAdded
                ? "border-green-800 bg-green-800 text-white"
                : "border-[#1a3a2e] text-[#1a3a2e] hover:bg-[#1a3a2e] hover:text-[#f9f6ef]"
            }`}
          >
            {!selectedVariant || selectedVariant.stock <= 0
              ? "Sold out"
              : isAdded
              ? "Added ✓"
              : "Add to bag"}
          </button>
        </div>
      </div>
    </div>
  );
}