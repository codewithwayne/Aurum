"use client";

import { useCart } from "./CartContext";
import Link from "next/link";
import { X } from "lucide-react";

export function CartDrawer() {
  const { 
    items, isCartOpen, closeCart, 
    updateQuantity, removeItem, subtotal, totalItems 
  } = useCart();

  return (
    <>
      {isCartOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      <div 
        className={`fixed right-0 top-0 z-[70] flex h-full w-full flex-col bg-[#f9f6ef] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[450px] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1a3a2e]/10 px-6 py-6">
          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e]">Your bag</h2>
            <p className="text-sm text-[#1a3a2e]/60">{totalItems} item(s)</p>
          </div>
          <button onClick={closeCart} className="p-2 text-[#1a3a2e]/60 hover:text-[#1a3a2e]">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg text-[#1a3a2e]/60">Your bag is empty.</p>
              <button onClick={closeCart} className="mt-4 text-sm underline underline-offset-4">
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#1a3a2e]/10">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 py-6">
                  {/* IMAGE RENDERED HERE */}
                  <div className="h-28 w-20 shrink-0 overflow-hidden bg-[#e8e2d5]">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-[#1a3a2e]">{item.name}</h3>
                        <p className="text-xs text-[#1a3a2e]/60">{item.size} · KSh {item.priceKes.toLocaleString()} each</p>
                      </div>
                      <button onClick={() => removeItem(item.variantId)} className="text-[#1a3a2e]/40 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#1a3a2e]/20">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-3 py-1 hover:bg-[#e8e2d5]">-</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-3 py-1 hover:bg-[#e8e2d5]">+</button>
                      </div>
                      
                      <p className="text-sm font-medium">KSh {(item.priceKes * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#1a3a2e]/10 bg-[#f0eadc] px-6 py-6">
            <div className="flex items-center justify-between text-lg font-medium text-[#1a3a2e]">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xs text-[#1a3a2e]/60">Delivery calculated at checkout.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <Link 
                href="/checkout" 
                onClick={closeCart}
                className="w-full bg-[#1a3a2e] py-4 text-center text-sm uppercase tracking-widest text-[#f9f6ef] transition-opacity hover:opacity-90"
              >
                Checkout
              </Link>
              <div className="flex gap-3">
                <button 
                  onClick={closeCart}
                  className="flex-1 border border-[#1a3a2e]/20 bg-transparent py-3 text-xs uppercase tracking-widest text-[#1a3a2e] transition-colors hover:border-[#1a3a2e]"
                >
                  Continue shopping
                </button>
                <Link 
                  href="/cart"
                  onClick={closeCart}
                  className="flex-1 border border-[#1a3a2e]/20 bg-transparent py-3 text-center text-xs uppercase tracking-widest text-[#1a3a2e] transition-colors hover:border-[#1a3a2e]"
                >
                  View bag
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}