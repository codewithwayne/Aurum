import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Always log the full payload first — this is how we diagnose issues
    console.log("🚨 PAYHERO CALLBACK:", JSON.stringify(body, null, 2));

    const { status, response } = body;

    if (!response || !response.ExternalReference) {
      console.error("❌ Invalid callback payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const orderNumber = response.ExternalReference;
    const resultCode = response.ResultCode;
    const mpesaReceipt = response.MpesaReceiptNumber;
    const innerStatus = response.Status;

    // 2. STRICT SUCCESS: All four conditions must be true
    const isSuccessful =
      status === true &&
      resultCode === 0 &&
      typeof mpesaReceipt === "string" &&
      mpesaReceipt.length > 0 &&
      innerStatus === "Success";

    // 3. EXPLICIT FAILURE: User cancelled (1037), user busy (1032), or PayHero reported a failure
    const isFailed =
      innerStatus === "Failed" ||
      innerStatus === "Cancelled" ||
      resultCode === 1037 ||
      resultCode === 1032;

    if (isSuccessful) {
      await db
        .update(orders)
        .set({ status: "paid", paymentStatus: "success" })
        .where(eq(orders.orderNumber, orderNumber));

      console.log(`✅ PAID: ${orderNumber} (Receipt: ${mpesaReceipt})`);
    } else if (isFailed) {
      await db
        .update(orders)
        .set({ status: "cancelled", paymentStatus: "failed" })
        .where(eq(orders.orderNumber, orderNumber));

      console.log(`❌ FAILED: ${orderNumber} (Code: ${resultCode})`);
    } else {
      // 4. PENDING: Do nothing. Wait for the real completion callback.
      console.log(
        `⏳ PENDING: ${orderNumber} (Code: ${resultCode}, Status: ${innerStatus}). Ignoring for now.`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}