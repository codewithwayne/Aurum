import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { CustomerLoginForm } from "@/components/customer/CustomerLoginForm";
import { customerLogout } from "@/lib/server/customer-actions";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const customerPhone = cookieStore.get("customer_phone")?.value;

  // --- RENDER LOGIN FORM IF NOT LOGGED IN ---
  if (!customerPhone) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f9f6ef] px-6">
        <CustomerLoginForm />
      </main>
    );
  }

  // --- RENDER DASHBOARD IF LOGGED IN ---
  const customerOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerPhone, customerPhone))
    .orderBy(desc(orders.createdAt));

  const latestOrder = customerOrders[0];

  return (
    <main className="min-h-screen bg-[#f9f6ef] px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-[1000px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#1a3a2e]/10 pb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60 mb-2">My Account</p>
            <h1 className="font-serif text-4xl text-[#1a3a2e]">Welcome, {latestOrder?.customerName.split(" ")[0]}</h1>
            <p className="mt-2 text-sm text-[#1a3a2e]/60">{customerPhone}</p>
          </div>
          <form action={customerLogout}>
            <button type="submit" className="mt-6 md:mt-0 text-sm underline underline-offset-4 hover:text-[#d4a84b] transition-colors">
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Order History */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-6">Order History</h2>
            
            {customerOrders.length === 0 ? (
              <p className="text-[#1a3a2e]/60">You have no orders yet.</p>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((order) => (
                  <Link href={`/account/orders/${order.orderNumber}`} key={order.id} className="block group">
                    <div className="bg-white border border-[#1a3a2e]/10 p-6 flex flex-col sm:flex-row justify-between gap-4 group-hover:border-[#1a3a2e]/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-[#1a3a2e] group-hover:text-[#d4a84b] transition-colors">
                            {order.orderNumber}
                          </p>
                          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded ${
                            order.paymentStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-[#1a3a2e]/60">
                          {new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                        <p className="text-sm text-[#1a3a2e]/80 mt-2">
                          {order.items.length} item(s) · KSh {order.totalKes.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="sm:text-right flex flex-col justify-between items-end">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-[#1a3a2e]/50 mb-1">Status</p>
                          <p className="capitalize text-sm font-medium">{order.status.replace(/_/g, " ")}</p>
                        </div>
                        {/* Arrow indicator */}
                        <span className="mt-4 text-xl text-[#1a3a2e]/30 group-hover:text-[#1a3a2e] transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Latest Details & Support */}
          <div className="space-y-8">
            {latestOrder && (
              <div className="bg-[#f0eadc] p-6">
                <h3 className="font-serif text-xl text-[#1a3a2e] mb-4">Latest Order</h3>
                <div className="space-y-2 text-sm text-[#1a3a2e]/80">
                  {latestOrder.items.map(item => (
                    <div key={item.variantId} className="flex justify-between">
                      <span>{item.quantity} × {item.name}</span>
                      <span>KSh {item.priceKes.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#1a3a2e]/10 text-sm font-medium flex justify-between">
                  <span>Total</span>
                  <span>KSh {latestOrder.totalKes.toLocaleString()}</span>
                </div>
                {latestOrder.deliveryMethod === "standard" && (
                  <p className="mt-4 text-xs text-[#1a3a2e]/60">
                    Delivering to: {latestOrder.deliveryAddress.estate}, {latestOrder.deliveryAddress.county}
                  </p>
                )}
              </div>
            )}

            <div className="bg-white border border-[#1a3a2e]/10 p-6">
              <h3 className="font-serif text-xl text-[#1a3a2e] mb-2">Need Help?</h3>
              <p className="text-sm text-[#1a3a2e]/70 mb-4">
                If you have questions about your order, our team is here to assist.
              </p>
              <Link href="/contact" className="text-sm underline underline-offset-4 hover:text-[#d4a84b]">
                Contact Support
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}