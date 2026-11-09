import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/server/resend";
import { generateReceiptPDF } from "@/lib/server/pdf"; // <-- Import this

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { status, response } = body;

    if (!response || !response.ExternalReference) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const orderNumber = response.ExternalReference;
    const resultCode = response.ResultCode;
    const mpesaReceipt = response.MpesaReceiptNumber;
    const innerStatus = response.Status;

    const isSuccessful =
      status === true &&
      resultCode === 0 &&
      typeof mpesaReceipt === "string" &&
      mpesaReceipt.length > 0 &&
      innerStatus === "Success";

    const isFailed =
      innerStatus === "Failed" ||
      innerStatus === "Cancelled" ||
      resultCode === 1037 ||
      resultCode === 1032;

    if (isSuccessful) {
      await db
        .update(orders)
        .set({ 
          status: "paid", 
          paymentStatus: "success",
          mpesaReceipt: mpesaReceipt
        })
        .where(eq(orders.orderNumber, orderNumber));

      const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);

      if (order) {
        const emailPromises = [
          sendAdminOrderNotification({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            totalKes: order.totalKes,
          })
        ];

        if (order.customerEmail) {
          // GENERATE PDF HERE
          const pdfBuffer = await generateReceiptPDF(order, mpesaReceipt);

          emailPromises.push(
            sendOrderConfirmationEmail({
              toEmail: order.customerEmail,
              customerName: order.customerName,
              orderNumber: order.orderNumber,
              totalKes: order.totalKes,
              items: order.items,
              pdfBuffer: pdfBuffer, // <-- Pass it here
              mpesaReceipt: mpesaReceipt,
            })
          );
        }

        await Promise.all(emailPromises);
      }
    } else if (isFailed) {
      await db
        .update(orders)
        .set({ status: "cancelled", paymentStatus: "failed" })
        .where(eq(orders.orderNumber, orderNumber));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}