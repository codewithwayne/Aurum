"use server";

import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function customerLogin(formData: FormData) {
  const phone = formData.get("phone") as string;
  const orderNumber = formData.get("orderNumber") as string;

  if (!phone || !orderNumber) {
    return { error: "Please enter both phone number and order number." };
  }

  // Check if this order actually belongs to this phone number
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.customerPhone, phone), eq(orders.orderNumber, orderNumber)))
    .limit(1);

  if (!order) {
    return { error: "No order found matching those details. Please check and try again." };
  }

  // Set the secure cookie (valid for 1 day)
  const cookieStore = await cookies();
  cookieStore.set({
    name: "customer_phone",
    value: phone,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1, 
    path: "/",
  });

  return { success: true };
}

export async function customerLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_phone");
  revalidatePath("/account");
}