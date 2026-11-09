import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateOrderStatus } from "@/lib/server/admin-actions";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);

  if (!order) notFound();

  return (
    <div>
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="font-serif text-3xl">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString("en-KE")}
          </p>
        </div>
        
        {/* Status Badges */}
        <div className="flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            order.paymentStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Payment: {order.paymentStatus}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
            {order.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Items & Address */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Items */}
          <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.variantId} className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100 last:border-0 gap-2">
                  <div>
                    <p className="font-medium text-[#1a3a2e]">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-medium">KSh {(item.priceKes * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>KSh {order.totalKes.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4">Delivery Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customerPhone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Address</p>
                <p className="font-medium">
                  {order.deliveryAddress.estate}, {order.deliveryAddress.county}
                  {order.deliveryAddress.building && `, ${order.deliveryAddress.building}`}
                  {order.deliveryAddress.landmark && ` (Near ${order.deliveryAddress.landmark})`}
                </p>
              </div>
              {order.deliveryAddress.instructions && (
                <div className="md:col-span-2">
                  <p className="text-gray-500">Additional Instructions</p>
                  <p className="font-medium italic">"{order.deliveryAddress.instructions}"</p>
                </div>
              )}
              <div className="md:col-span-2 mt-2">
                <p className="text-gray-500">Delivery Method</p>
                <p className="font-medium capitalize">{order.deliveryMethod.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4">Update Status</h2>
            
            <form action={updateOrderStatus} className="space-y-4">
              <input type="hidden" name="orderNumber" value={order.orderNumber} />
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Fulfillment Status</label>
                <select 
                  name="status" 
                  defaultValue={order.status}
                  className="w-full border border-gray-200 p-3 md:p-2 text-sm focus:border-[#1a3a2e] focus:outline-none bg-white"
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid (Processing)</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#1a3a2e] py-3 text-sm uppercase tracking-widest text-white hover:opacity-90"
              >
                Save Status
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}