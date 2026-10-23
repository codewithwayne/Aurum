"use client";

import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-12">
        <h1 className="font-serif text-4xl text-[#1a3a2e]">Your Bag is Empty</h1>
        <p className="mt-4 text-[#1a3a2e]/70">Looks like you haven't added any fragrances yet.</p>
        <Link href="/shop" className="mt-8 inline-block bg-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#f9f6ef] hover:opacity-90">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-6 py-16 lg:px-12">
      <h1 className="font-serif text-4xl text-[#1a3a2e]">Your Bag ({totalItems})</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-3">
        {/* Item List */}
        <div className="lg:col-span-2">
          <div className="border-t border-[#1a3a2e]/10">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-6 border-b border-[#1a3a2e]/10 py-8">
                <div className="h-32 w-24 shrink-0 bg-[#e8e2d5]">
                  {/* Image placeholder */}
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-serif text-xl text-[#1a3a2e]">
                        <Link href={`/products/${item.slug}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-[#1a3a2e]/60">Size: {item.size}</p>
                    </div>
                    <p className="font-medium text-[#1a3a2e]">KSh {(item.priceKes * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-[#1a3a2e]/20">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-3 py-1 hover:bg-[#e8e2d5]">-</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-3 py-1 hover:bg-[#e8e2d5]">+</button>
                    </div>
                    <button onClick={() => removeItem(item.variantId)} className="text-[#1a3a2e]/50 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#f0eadc] p-8">
          <h2 className="font-serif text-2xl text-[#1a3a2e]">Summary</h2>
          <div className="mt-6 space-y-4 text-sm text-[#1a3a2e]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-[#1a3a2e]/60">Calculated at checkout</span>
            </div>
            <div className="border-t border-[#1a3a2e]/10 pt-4 flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-8 block w-full bg-[#1a3a2e] py-4 text-center text-sm uppercase tracking-widest text-[#f9f6ef] transition-opacity hover:opacity-90">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}