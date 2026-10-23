"use client";

import { useState } from "react";
import { FilterState } from "./ShopClient";

const CATEGORIES = ["women", "men", "unisex"];
const FAMILIES = ["Sweet", "Fresh", "Woody", "Floral", "Amber"];
const OCCASIONS = ["Everyday Wear", "Office", "Summer", "Date Night", "Evening"];

export function FilterSidebar({
  filters,
  toggleFilter,
  toggleInStock,
  setSearch,
  clearAll,
}: {
  filters: FilterState;
  toggleFilter: (key: keyof FilterState, value: string) => void;
  toggleInStock: () => void;
  setSearch: (term: string) => void;
  clearAll: () => void;
}) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  return (
    <aside className="w-full shrink-0 lg:w-[250px]">
      <form onSubmit={handleSearch} className="mb-10">
        <input
          type="text"
          placeholder="Search within..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full border-b border-[#1a3a2e]/20 bg-transparent pb-2 text-sm text-[#1a3a2e] placeholder:text-[#1a3a2e]/40 focus:border-[#1a3a2e] focus:outline-none"
        />
      </form>

      <div className="mb-10">
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a3a2e]/60">Category</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-3 text-sm text-[#1a3a2e] capitalize">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleFilter("categories", cat)}
                className="h-4 w-4 appearance-none border border-[#1a3a2e]/30 checked:bg-[#1a3a2e] checked:border-[#1a3a2e]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a3a2e]/60">Fragrance Family</h3>
        <div className="space-y-3">
          {FAMILIES.map((fam) => (
            <label key={fam} className="flex cursor-pointer items-center gap-3 text-sm text-[#1a3a2e]">
              <input
                type="checkbox"
                checked={filters.families.includes(fam)}
                onChange={() => toggleFilter("families", fam)}
                className="h-4 w-4 appearance-none border border-[#1a3a2e]/30 checked:bg-[#1a3a2e] checked:border-[#1a3a2e]"
              />
              {fam}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1a3a2e]/60">Occasion</h3>
        <div className="space-y-3">
          {OCCASIONS.map((occ) => (
            <label key={occ} className="flex cursor-pointer items-center gap-3 text-sm text-[#1a3a2e]">
              <input
                type="checkbox"
                checked={filters.occasions.includes(occ)}
                onChange={() => toggleFilter("occasions", occ)}
                className="h-4 w-4 appearance-none border border-[#1a3a2e]/30 checked:bg-[#1a3a2e] checked:border-[#1a3a2e]"
              />
              {occ}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-[#1a3a2e]">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={toggleInStock}
            className="h-4 w-4 appearance-none border border-[#1a3a2e]/30 checked:bg-[#1a3a2e] checked:border-[#1a3a2e]"
          />
          In stock only
        </label>
      </div>

      {/* Clear All Button */}
      <button
        onClick={clearAll}
        className="text-xs uppercase tracking-widest text-[#1a3a2e]/50 hover:text-[#1a3a2e] underline underline-offset-4"
      >
        Clear all filters
      </button>
    </aside>
  );
}