import { db } from "@/lib/db";
import { orders, productVariants } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. Fetch paid orders for revenue calculation
  const paidOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.paymentStatus, "success"));

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalKes, 0);
  const totalOrders = paidOrders.length;

  // 2. Fetch recent orders (any status)
  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // 3. Fetch low stock variants (stock < 5)
  const lowStock = await db
    .select()
    .from(productVariants)
    .where(sql`${productVariants.stock} < 5`)
    .limit(5);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-medium">KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Successful Orders</p>
          <p className="text-3xl font-medium">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
          <p className="text-3xl font-medium">{lowStock.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm underline text-gray-500 hover:text-black">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">KSh {order.totalKes.toLocaleString()}</p>
                    <p className={`text-xs ${
                      order.paymentStatus === 'success' ? 'text-green-600' : 
                      order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-200 shadow-sm p-6">
          <h2 className="font-serif text-xl mb-4">Low Stock Alerts</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">All items are well-stocked.</p>
          ) : (
            <div className="space-y-4">
              {lowStock.map((variant) => (
                <div key={variant.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <p className="text-sm font-medium">{variant.sku}</p>
                  <p className="text-xs text-red-600">{variant.stock} remaining</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}