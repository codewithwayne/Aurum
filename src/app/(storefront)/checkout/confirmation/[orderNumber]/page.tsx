import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { notFound } from "next/navigation";
import { OrderStatusTracker } from "@/components/checkout/OrderStatusTracker";

type Props = { params: Promise<{ orderNumber: string }> };

export default async function ConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <OrderStatusTracker orderNumber={order.orderNumber} totalKes={order.totalKes} />

      <div className="mt-16 bg-[#f0eadc] p-8 text-left">
        <h2 className="font-serif text-xl text-[#1a3a2e]">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <div key={item.variantId} className="flex justify-between">
              <span>{item.quantity} × {item.name} ({item.size})</span>
              <span>KSh {(item.priceKes * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-[#1a3a2e]/10 pt-4 flex justify-between font-medium text-lg">
          <span>Total Paid</span>
          <span>KSh {order.totalKes.toLocaleString()}</span>
        </div>
      </div>
    </main>
  );
}