import { db } from "@/lib/db";
import { customers, orders } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export default async function AdminCustomersPage() {
  // Fetch all customers
  const allCustomers = await db
    .select()
    .from(customers)
    .orderBy(desc(customers.createdAt));

  // Fetch all orders to calculate lifetime value
  const allOrders = await db.select().from(orders);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Customers</h1>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No customers yet.
                </td>
              </tr>
            ) : (
              allCustomers.map((customer) => {
                // Filter orders for this customer (only count successful payments)
                const customerOrders = allOrders.filter(
                  (o) => o.customerId === customer.id && o.paymentStatus === "success"
                );
                const totalSpent = customerOrders.reduce((sum, o) => sum + o.totalKes, 0);

                return (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1a3a2e]">{customer.name}</p>
                      <p className="text-xs text-gray-500">ID: {customer.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>{customer.phone}</p>
                      <p className="text-xs text-gray-500">{customer.email || "No email"}</p>
                    </td>
                    <td className="px-6 py-4">
                      {customerOrders.length} order{customerOrders.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      KSh {totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}