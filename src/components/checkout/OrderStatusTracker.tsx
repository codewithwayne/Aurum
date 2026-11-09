"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function OrderStatusTracker({
  orderNumber,
  totalKes,
}: {
  orderNumber: string;
  totalKes: number;
}) {
  const [status, setStatus] = useState<"pending" | "paid" | "failed">("pending");

  useEffect(() => {
    if (status !== "pending") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}/status`);
        const data = await res.json();
        
        if (data.paymentStatus === "success") {
          setStatus("paid");
        } else if (data.paymentStatus === "failed") {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Failed to check status", error);
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [status, orderNumber]);

  if (status === "pending") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#1a3a2e]/20 border-t-[#1a3a2e]" />
        <h1 className="font-serif text-4xl text-[#1a3a2e]">Check Your Phone</h1>
        <p className="mt-4 text-[#1a3a2e]/70">
          We have sent an M-Pesa prompt to your phone for <strong>KSh {totalKes.toLocaleString()}</strong>.
          Please enter your PIN to complete the payment.
        </p>
        <p className="mt-2 text-sm text-[#1a3a2e]/50">Waiting for confirmation...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center">
        <h1 className="font-serif text-4xl text-red-800">Payment Failed</h1>
        <p className="mt-4 text-[#1a3a2e]/70">
          We could not process your payment for order <strong>{orderNumber}</strong>.
          No money was deducted.
        </p>
        <Link href="/checkout" className="mt-8 inline-block bg-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#f9f6ef]">
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-serif text-4xl text-[#1a3a2e]">Payment Received</h1>
      <p className="mt-4 text-[#1a3a2e]/70">
        Thank you for shopping with Aurum Parfums. Your order <strong>{orderNumber}</strong> is confirmed.
      </p>
      <p className="mt-6 text-sm text-[#1a3a2e]/60">
        Our team will reach out to you shortly on the phone number provided to arrange delivery.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={`/account/orders/${orderNumber}`}
          className="inline-block bg-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#f9f6ef] transition-opacity hover:opacity-90"
        >
          View Full Receipt
        </Link>
        <Link href="/shop" className="inline-block border border-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#1a3a2e] transition-colors hover:bg-[#1a3a2e] hover:text-[#f9f6ef]">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}