"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { FilterSidebar } from "./FilterSidebar";

type Variant = {
  id: string;
  productId: string;
  size: string;
  priceKes: number;
  stock: number;
  sku: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  shortDescription: string;
  fragranceFamily: string | null;
  occasions: string[] | null;
  isBestseller: boolean;
  isNewArrival: boolean;
  images: string[];
};

export type FilterState = {
  categories: string[];
  families: string[];
  occasions: string[];
  inStock: boolean;
  search: string;
};

export function ShopClient({
  initialProducts,
  variantsByProduct,
}: {
  initialProducts: Product[];
  variantsByProduct: Record<string, Variant[]>;
}) {
  const searchParams = useSearchParams();

  // 1. Initialize state from the URL (so shared links work)
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.getAll("category"),
    families: searchParams.getAll("family"),
    occasions: searchParams.getAll("occasion"),
    inStock: searchParams.get("inStock") === "true",
    search: searchParams.get("search") || "",
  });

  // 2. Silently update the URL when state changes (No server fetch!)
  useEffect(() => {
    const params = new URLSearchParams();
    filters.categories.forEach((c) => params.append("category", c));
    filters.families.forEach((f) => params.append("family", f));
    filters.occasions.forEach((o) => params.append("occasion", o));
    if (filters.inStock) params.set("inStock", "true");
    if (filters.search) params.set("search", filters.search);

    const newUrl = params.toString() ? `?${params.toString()}` : "/shop";
    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // 3. Toggle function
  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [key]: isSelected
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      };
    });
  };

  const toggleInStock = () => {
    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }));
  };

  const setSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
  };

  const clearAll = () => {
    setFilters({ categories: [], families: [], occasions: [], inStock: false, search: "" });
  };

  // 4. INSTANT Filtering Logic
  const filteredProducts = initialProducts.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
    
    if (filters.families.length > 0 && (!p.fragranceFamily || !filters.families.includes(p.fragranceFamily))) return false;
    
    if (filters.occasions.length > 0) {
      const productOccasions = p.occasions || [];
      if (!filters.occasions.some((occ) => productOccasions.includes(occ))) return false;
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        p.shortDescription.toLowerCase().includes(term);
      if (!match) return false;
    }

    if (filters.inStock) {
      const variants = variantsByProduct[p.id] || [];
      if (!variants.some((v) => v.stock > 0)) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-12 lg:flex-row w-full">
      {/* Pass state and functions to the Sidebar */}
      <FilterSidebar
        filters={filters}
        toggleFilter={toggleFilter}
        toggleInStock={toggleInStock}
        setSearch={setSearch}
        clearAll={clearAll}
      />

      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-[#1a3a2e]/60">
            {filteredProducts.length} fragrance{filteredProducts.length === 1 ? "" : "s"}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-[#1a3a2e]/60">No products match your filters.</p>
            <button
              onClick={clearAll}
              className="mt-4 text-sm underline underline-offset-4 hover:text-[#1a3a2e]"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variants={variantsByProduct[p.id] || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}