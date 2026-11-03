"use client"; // <--- THIS IS CRITICAL

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  // 1. Grab the total items from our global cart state
  const { totalItems, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement Bar */}
      <div className="bg-[#1a3a2e] py-2 text-center text-[10px] uppercase tracking-[0.2em] text-[#f9f6ef]">
        Smell like money. · Delivery across Kenya
      </div>

      {/* Main Nav */}
      <div className="border-b border-[#1a3a2e]/10 bg-[#f9f6ef]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-12">
          
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl tracking-tight text-[#1a3a2e]">
            Aurum <span className="italic">Parfums</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden gap-8 text-sm text-[#1a3a2e] md:flex">
            <Link href="/shop" className="hover:underline underline-offset-4">Shop</Link>
            <Link href="/collections" className="hover:underline underline-offset-4">Collections</Link>
            <Link href="/about" className="hover:underline underline-offset-4">Our Story</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-6 text-[#1a3a2e]">
            <Link href="/search" aria-label="Search"><Search size={20} strokeWidth={1.5} /></Link>
            <Link href="/account" aria-label="Account"><User size={20} strokeWidth={1.5} /></Link>
            
            {/* THE CART ICON & BADGE */}
            <button onClick={openCart} aria-label="Cart" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              
              {/* Only show the badge if totalItems > 0 */}
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4a84b] text-[10px] font-bold text-[#1a3a2e]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}