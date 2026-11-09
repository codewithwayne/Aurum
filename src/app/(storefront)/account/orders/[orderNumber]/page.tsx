import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const cookieStore = await cookies();
  const customerPhone = cookieStore.get("customer_phone")?.value;

  // If they aren't "logged in", send them to the login page
  if (!customerPhone) {
    redirect("/account");
  }

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  // If order doesn't exist OR doesn't belong to this customer, show 404
  if (!order || order.customerPhone !== customerPhone) {
    notFound();
  }

  // Status Timeline Logic
  const statuses = ["pending_payment", "paid", "dispatched", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e] px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-3xl">
        
        {/* Header */}
        <div className="mb-10">
          <Link href="/account" className="text-sm text-[#1a3a2e]/60 hover:text-[#1a3a2e] underline underline-offset-4 mb-4 inline-block">
            ← Back to Account
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-serif text-4xl">Order {order.orderNumber}</h1>
              <p className="text-sm text-[#1a3a2e]/60 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs uppercase tracking-widest font-medium rounded-full ${
              order.paymentStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white border border-[#1a3a2e]/10 p-8 mb-8">
          <h2 className="font-serif text-xl mb-6">Fulfillment Status</h2>
          <div className="flex items-center justify-between relative">
            {/* Background line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#1a3a2e]/10 z-0" />
            {/* Active line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#1a3a2e] z-0 transition-all duration-500" 
              style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}
            />
            
            {statuses.map((status, index) => {
              const isActive = index <= currentStatusIndex;
              return (
                <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`h-4 w-4 rounded-full border-2 ${isActive ? 'bg-[#1a3a2e] border-[#1a3a2e]' : 'bg-white border-[#1a3a2e]/20'}`} />
                  <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'text-[#1a3a2e] font-medium' : 'text-[#1a3a2e]/40'}`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-[#1a3a2e]/10 p-8 mb-8">
          <h2 className="font-serif text-xl mb-6">Items Purchased</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.variantId} className="flex justify-between items-center border-b border-[#1a3a2e]/10 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-[#1a3a2e]">{item.name}</p>
                  <p className="text-sm text-[#1a3a2e]/60">{item.size} × {item.quantity}</p>
                </div>
                <p className="font-medium">KSh {(item.priceKes * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#1a3a2e]/10 space-y-2 text-sm">
            <div className="flex justify-between text-[#1a3a2e]/70">
              <span>Subtotal</span>
              <span>KSh {order.subtotalKes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#1a3a2e]/70">
              <span>Delivery</span>
              <span>{order.deliveryFeeKes === 0 ? "Arranged own" : `KSh ${order.deliveryFeeKes.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2">
              <span>Total</span>
              <span>KSh {order.totalKes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-[#1a3a2e]/10 p-8">
            <h2 className="font-serif text-xl mb-4">Delivery Details</h2>
            <div className="text-sm text-[#1a3a2e]/80 space-y-2">
              <p className="font-medium text-[#1a3a2e]">{order.customerName}</p>
              <p>{order.customerPhone}</p>
              <p>{order.deliveryAddress.estate}, {order.deliveryAddress.county}</p>
              {order.deliveryAddress.building && <p>{order.deliveryAddress.building}</p>}
              {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
              {order.deliveryAddress.instructions && <p className="italic">"{order.deliveryAddress.instructions}"</p>}
            </div>
          </div>

          <div className="bg-white border border-[#1a3a2e]/10 p-8">
            <h2 className="font-serif text-xl mb-4">Payment Info</h2>
            <div className="text-sm text-[#1a3a2e]/80 space-y-2">
              <p>Method: M-Pesa</p>
              <p>Status: <strong className="capitalize text-[#1a3a2e]">{order.paymentStatus}</strong></p>
              {order.mpesaReceipt && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-900 rounded">
                  <p className="text-xs uppercase tracking-widest mb-1">M-Pesa Receipt</p>
                  <p className="font-mono text-sm">{order.mpesaReceipt}</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}