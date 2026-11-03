"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    county: "",
    estate: "",
    building: "",
    landmark: "",
    instructions: "",
    deliveryMethod: "standard",
  });

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="mx-auto max-w-[1400px] px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-[#1a3a2e]">Your bag is empty</h1>
        <Link href="/shop" className="mt-8 inline-block bg-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#f9f6ef]">
          Return to Shop
        </Link>
      </main>
    );
  }

  const deliveryFee = formData.deliveryMethod === "standard" ? 300 : 0;
  const finalTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        customer: formData,
        cartItems: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      clearCart();
      router.push(`/checkout/confirmation/${data.orderNumber}`);

    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] px-6 py-16 lg:px-12">
      <h1 className="font-serif text-4xl text-[#1a3a2e]">Checkout</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[#1a3a2e]/60">Contact Information</h2>
            <div className="space-y-4">
              <input
                required type="text" placeholder="Full Name"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
              />
              
              <div>
                <input
                  required type="tel" placeholder="0712 345 678"
                  value={formData.phone} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: val });
                  }}
                  pattern="^0[0-9]{9}$"
                  title="Phone number must be 10 digits and start with 0"
                  className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="email" placeholder="Email address (Optional, for receipt)"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[#1a3a2e]/60">Delivery Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryMethod: "standard" })}
                className={`border p-4 text-left transition-colors ${
                  formData.deliveryMethod === "standard"
                    ? "border-[#1a3a2e] bg-[#1a3a2e]/5"
                    : "border-[#1a3a2e]/20 hover:border-[#1a3a2e]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Standard Delivery</span>
                  <span className="text-sm font-medium">KSh 300</span>
                </div>
                <p className="mt-1 text-xs text-[#1a3a2e]/60">
                  Nairobi: within 4 hours.<br/>
                  Outside Nairobi: 1-2 days.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryMethod: "arrange_own" })}
                className={`border p-4 text-left transition-colors ${
                  formData.deliveryMethod === "arrange_own"
                    ? "border-[#1a3a2e] bg-[#1a3a2e]/5"
                    : "border-[#1a3a2e]/20 hover:border-[#1a3a2e]/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Arrange Own</span>
                  <span className="text-sm font-medium">KSh 0</span>
                </div>
                <p className="mt-1 text-xs text-[#1a3a2e]/60">Use Uber, Bolt, or your own courier.</p>
              </button>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-[#1a3a2e]/60">Delivery Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required type="text" placeholder="County / City"
                  value={formData.county} onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
                />
                <input
                  required type="text" placeholder="Estate / Area"
                  value={formData.estate} onChange={(e) => setFormData({ ...formData, estate: e.target.value })}
                  className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
                />
              </div>
              <input
                type="text" placeholder="Building / Apartment (Optional)"
                value={formData.building} onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
              />
              <input
                required type="text" placeholder="Street / Road / Landmark"
                value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
              />
              <textarea
                placeholder="Additional directions (Optional)"
                value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none" rows={3}
              />
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-[#1a3a2e] py-4 text-sm uppercase tracking-widest text-[#f9f6ef] hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : `Pay KSh ${finalTotal.toLocaleString()}`}
          </button>
        </form>

        <div className="bg-[#f0eadc] p-8 h-fit">
          <h2 className="font-serif text-2xl text-[#1a3a2e]">Order Summary</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-sm">
                <span>{item.quantity} × {item.name} ({item.size})</span>
                <span>KSh {(item.priceKes * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-[#1a3a2e]/10 pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "To be arranged" : `KSh ${deliveryFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between border-t border-[#1a3a2e]/10 pt-3 font-medium text-lg">
              <span>Total</span>
              <span>KSh {finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}