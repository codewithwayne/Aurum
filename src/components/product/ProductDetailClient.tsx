"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductBuyBox } from "./ProductBuyBox";

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
  brand: string | null;
  category: string;
  shortDescription: string;
  fullDescription: string;
  fragranceFamily: string | null;
  scentNotes: any;
  occasions: string[] | null;
  images: string[];
};

export function ProductDetailClient({ product, variants }: { product: Product; variants: Variant[] }) {
  // 1. Manage the selected variant here so both the image and buy box can use it
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // 2. The active image is the variant image, or the default product image
  const activeImage = selectedVariant?.image || product.images?.[0];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
      {/* LEFT: Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#e8e2d5] lg:sticky lg:top-24">
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* RIGHT: Product Details */}
      <div className="flex flex-col pt-4 lg:pt-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60">
          {product.brand || "Aurum Parfums"}
        </p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
        
        <p className="mt-6 text-lg text-[#1a3a2e]/80">
          {product.shortDescription}
        </p>

        {/* Pass state down to the buy box */}
        <ProductBuyBox 
          variants={variants} 
          product={product} 
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
        />

        <div className="mt-16 border-t border-[#1a3a2e]/10">
          <details className="group border-b border-[#1a3a2e]/10 py-6">
            <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
              <span>Scent profile</span>
              <span className="transition group-open:rotate-180">↓</span>
            </summary>
            <div className="pt-4 text-sm text-[#1a3a2e]/70">
              <p><strong>Family:</strong> {product.fragranceFamily}</p>
              {product.scentNotes && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div><strong className="text-[#1a3a2e]">Top:</strong><br/>{product.scentNotes.top?.join(", ")}</div>
                  <div><strong className="text-[#1a3a2e]">Heart:</strong><br/>{product.scentNotes.heart?.join(", ")}</div>
                  <div><strong className="text-[#1a3a2e]">Base:</strong><br/>{product.scentNotes.base?.join(", ")}</div>
                </div>
              )}
            </div>
          </details>

          <details className="group border-b border-[#1a3a2e]/10 py-6">
            <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
              <span>How it wears</span>
              <span className="transition group-open:rotate-180">↓</span>
            </summary>
            <div className="pt-4 text-sm text-[#1a3a2e]/70">
              <p>{product.fullDescription}</p>
            </div>
          </details>

          <details className="group border-b border-[#1a3a2e]/10 py-6">
            <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
              <span>Delivery information</span>
              <span className="transition group-open:rotate-180">↓</span>
            </summary>
            <div className="pt-4 text-sm text-[#1a3a2e]/70">
              <p>Estimated delivery: 1–2 days in Nairobi, 2–4 days elsewhere in Kenya. Flat rate of KSh 300.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}