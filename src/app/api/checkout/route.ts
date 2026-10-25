import { NextResponse } from "next/server";
import { z } from "zod";
import { inArray, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, productVariants, products } from "@/lib/db/schema";
import { initiateStkPush } from "@/lib/server/payhero";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    // Enforce exactly 10 digits starting with 0
    phone: z.string().regex(/^0[0-9]{9}$/, "Phone number must be 10 digits and start with 0"),
    county: z.string(),
    estate: z.string(),
    building: z.string(),
    landmark: z.string(),
    instructions: z.string(),
    deliveryMethod: z.enum(["standard", "arrange_own"]),
  }),
  cartItems: z.array(z.object({
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate the request body
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.format() }, 
        { status: 400 }
      );
    }

    const { customer, cartItems } = parsed.data;

    // 2. Fetch the real variants from the database
    const variantIds = cartItems.map((i) => i.variantId);
    const dbVariants = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.id, variantIds));

    // 3. Verify stock and calculate true subtotal securely on the server
    let subtotal = 0;
    const orderItemsSnapshot = [];

    for (const item of cartItems) {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      
      if (!variant) {
        return NextResponse.json({ error: "Product not found" }, { status: 400 });
      }
      
      if (variant.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for SKU: ${variant.sku}` }, { status: 400 });
      }

      // Fetch product name for the order snapshot
      const [product] = await db.select().from(products).where(eq(products.id, variant.productId));

      subtotal += variant.priceKes * item.quantity;
      
      orderItemsSnapshot.push({
        productId: variant.productId,
        variantId: variant.id,
        name: product.name,
        size: variant.size,
        priceKes: variant.priceKes,
        quantity: item.quantity,
      });
    }

    // 4. Calculate final total securely
    const deliveryFeeKes = customer.deliveryMethod === "standard" ? 300 : 0;
    const totalKes = subtotal + deliveryFeeKes;
    
    // 5. Generate an order number
    const orderNumber = `AU-${Math.floor(1000 + Math.random() * 9000)}`;

    // 6. Save the Order to the database (Status: pending_payment)
    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryMethod: customer.deliveryMethod,
      deliveryAddress: {
        county: customer.county,
        estate: customer.estate,
        building: customer.building,
        landmark: customer.landmark,
        instructions: customer.instructions,
      },
      items: orderItemsSnapshot,
      subtotalKes: subtotal,
      deliveryFeeKes,
      totalKes,
      status: "pending_payment",
      paymentStatus: "pending",
    }).returning();

    // 7. Trigger PayHero STK Push
    // Format phone: 0712345678 → 254712345678
    const formattedPhone = customer.phone.replace(/^0/, "254");

    try {
      await initiateStkPush({
        amount: totalKes,
        phoneNumber: formattedPhone,
        externalReference: orderNumber,
      });
    } catch (payheroError) {
      console.error("PayHero Error:", payheroError);
      // The order is saved, but the prompt failed to send. 
      // We return 502 so the client knows to show a retry message.
      return NextResponse.json(
        { error: "Order saved, but the M-Pesa prompt could not be sent. Please try again." },
        { status: 502 }
      );
    }

    // 8. Return success
    return NextResponse.json({ 
      success: true, 
      orderNumber: newOrder.orderNumber,
      message: "STK Push sent. Check your phone." 
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}