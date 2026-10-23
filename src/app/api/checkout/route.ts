import { NextResponse } from "next/server";
import { z } from "zod";
import { inArray, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, productVariants, products } from "@/lib/db/schema";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    
    // UPDATED: Enforce 10 digits starting with 0
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
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { customer, cartItems } = parsed.data;

    const variantIds = cartItems.map((i) => i.variantId);
    const dbVariants = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.id, variantIds));

    let subtotal = 0;
    const orderItemsSnapshot = [];

    for (const item of cartItems) {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      if (!variant) return NextResponse.json({ error: "Product not found" }, { status: 400 });
      if (variant.stock < item.quantity) return NextResponse.json({ error: `Not enough stock for ${variant.sku}` }, { status: 400 });

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

    // SECURE CALCULATION: Determine fee on the server
    const deliveryFeeKes = customer.deliveryMethod === "standard" ? 300 : 0;
    const totalKes = subtotal + deliveryFeeKes;
    const orderNumber = `AU-${Math.floor(1000 + Math.random() * 9000)}`;

    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryMethod: customer.deliveryMethod, // Save the method
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

    return NextResponse.json({ success: true, orderNumber: newOrder.orderNumber });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}