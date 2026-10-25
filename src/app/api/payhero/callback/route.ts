import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Payhero sends a status and an external reference
    const { status, external_reference, transaction_id } = body;

    if (status === 'Success' && external_reference) {
      // Find the order and mark it as paid
      await db.update(orders)
        .set({ 
          status: 'paid', 
          paymentStatus: 'success',
          // You could also store the transaction_id here
        })
        .where(eq(orders.orderNumber, external_reference));
    } else if (status === 'Failed') {
      await db.update(orders)
        .set({ status: 'cancelled', paymentStatus: 'failed' })
        .where(eq(orders.orderNumber, external_reference));
    }

    // Always return a 200 OK so Payhero knows you received the message
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}