import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function ConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  
  // Fetch the order directly from the database
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#d4a84b]">Thank you</p>
      <h1 className="mt-4 font-serif text-5xl text-[#1a3a2e]">Check Your Phone</h1>
      
      <p className="mt-6 text-[#1a3a2e]/70">
        We have sent an M-Pesa prompt to your phone for order <strong>{order.orderNumber}</strong>. 
        Please enter your PIN to complete the payment of <strong>KSh {order.totalKes.toLocaleString()}</strong>.
      </p>

      <div className="mt-12 bg-[#f0eadc] p-8 text-left">
        <h2 className="font-serif text-xl text-[#1a3a2e]">Order Summary</h2>
        
        {/* Items */}
        <div className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex justify-between">
              <span>{item.quantity} × {item.name} ({item.size})</span>
              <span>KSh {(item.priceKes * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 border-t border-[#1a3a2e]/10 pt-4 flex justify-between font-medium text-lg">
          <span>Total Amount</span>
          <span>KSh {order.totalKes.toLocaleString()}</span>
        </div>

        {/* Delivery Details */}
        <div className="mt-6 border-t border-[#1a3a2e]/10 pt-6 text-sm text-[#1a3a2e]/70">
          <p className="font-medium text-[#1a3a2e] mb-2">Delivery Information</p>
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.customerPhone}</p>
          <p><strong>Location:</strong> {order.deliveryAddress.estate}, {order.deliveryAddress.county}</p>
          {order.deliveryAddress.landmark && <p><strong>Landmark:</strong> {order.deliveryAddress.landmark}</p>}
          {order.deliveryAddress.instructions && <p><strong>Instructions:</strong> {order.deliveryAddress.instructions}</p>}
          
          <p className="mt-4">
            <strong>Method:</strong>{" "}
            {order.deliveryMethod === "standard" 
              ? "Standard Delivery (Nairobi: within 4 hours. Outside Nairobi: 1-2 days)." 
              : "Customer Arranging Own Delivery"}
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-[#1a3a2e]/60">
        If you do not receive the prompt within 30 seconds, please check your network and try again. 
        Do not close this window until the payment is complete.
      </p>

      <Link 
        href="/shop" 
        className="mt-8 inline-block border border-[#1a3a2e] px-8 py-3 text-sm uppercase tracking-widest text-[#1a3a2e] transition-colors hover:bg-[#1a3a2e] hover:text-[#f9f6ef]"
      >
        Return to Shop
      </Link>
    </main>
  );
}