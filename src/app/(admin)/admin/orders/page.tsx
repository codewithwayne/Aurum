import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Orders</h1>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1a3a2e]">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">KSh {order.totalKes.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        order.paymentStatus === 'success' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {order.status.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.orderNumber}`}
                        className="text-sm font-medium underline text-[#1a3a2e] hover:text-black"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}