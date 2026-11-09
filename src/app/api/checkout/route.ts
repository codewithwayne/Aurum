import { NextResponse } from "next/server";
import { z } from "zod";
import { inArray, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, productVariants, products, customers } from "@/lib/db/schema";
import { initiateStkPush } from "@/lib/server/payhero";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^0[0-9]{9}$/, "Phone number must be 10 digits and start with 0"),
    email: z.string().optional(), 
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
      return NextResponse.json(
        { error: "Invalid request data", details: parsed.error.format() }, 
        { status: 400 }
      );
    }

    const { customer, cartItems } = parsed.data;

    // 1. Find or Create Customer
    let customerId: string;
    
    const [existingCustomer] = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, customer.phone))
      .limit(1);

    if (existingCustomer) {
      customerId = existingCustomer.id;
      
      // Update their info if they provided new details
      if (customer.email !== existingCustomer.email || customer.name !== existingCustomer.name) {
        await db.update(customers).set({
          name: customer.name,
          email: customer.email || existingCustomer.email,
          updatedAt: new Date(),
        }).where(eq(customers.id, customerId));
      }
    } else {
      const [newCustomer] = await db.insert(customers).values({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || null,
      }).returning();
      customerId = newCustomer.id;
    }

    // 2. Fetch variants
    const variantIds = cartItems.map((i) => i.variantId);
    const dbVariants = await db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.id, variantIds));

    // 3. Verify stock and calculate subtotal
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

    // 4. Calculate final total
    const deliveryFeeKes = customer.deliveryMethod === "standard" ? 300 : 0;
    const totalKes = subtotal + deliveryFeeKes;
    
    // 5. Generate order number
    const orderNumber = `AU-${Math.floor(1000 + Math.random() * 9000)}`;

    // 6. Save the Order (now linked to the customerId)
    const [newOrder] = await db.insert(orders).values({
      orderNumber,
      customerId, // <-- LINK TO CUSTOMER
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email || null,
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
    const formattedPhone = customer.phone.replace(/^0/, "254");

    try {
      await initiateStkPush({
        amount: totalKes,
        phoneNumber: formattedPhone,
        externalReference: orderNumber,
      });
    } catch (payheroError) {
      console.error("PayHero Error:", payheroError);
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