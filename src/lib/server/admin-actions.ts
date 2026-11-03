"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, products, productVariants } from "@/lib/db/schema";

// --- UPDATE ORDER STATUS ---
export async function updateOrderStatus(formData: FormData) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }

  const orderNumber = formData.get("orderNumber") as string;
  const newStatus = formData.get("status") as string;

  if (!orderNumber || !newStatus) throw new Error("Missing required fields");

  await db
    .update(orders)
    .set({ status: newStatus })
    .where(eq(orders.orderNumber, orderNumber));

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderNumber}`);
}

// --- CREATE PRODUCT ---
const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  brand: z.string().optional(),
  category: z.enum(["men", "women", "unisex"]),
  shortDescription: z.string().min(5),
  fullDescription: z.string().min(10),
  fragranceFamily: z.string().optional(),
  isPublished: z.boolean(),
  isBestseller: z.boolean(),
  isNewArrival: z.boolean(),
});

export async function createProduct(formData: FormData) {
  try {
    // 1. Verify Admin Authorization
    const cookieStore = await cookies();
    if (cookieStore.get("admin_session")?.value !== "authenticated") {
      throw new Error("Unauthorized");
    }

    // 2. Parse basic fields
    const basicData = createProductSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      brand: formData.get("brand") || undefined,
      category: formData.get("category"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription"),
      fragranceFamily: formData.get("fragranceFamily") || undefined,
      isPublished: formData.get("isPublished") === "on",
      isBestseller: formData.get("isBestseller") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
    });

    // 3. Parse JSON arrays
    const parseArray = (str: string | null) =>
      str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const scentNotes = {
      top: parseArray(formData.get("topNotes") as string),
      heart: parseArray(formData.get("heartNotes") as string),
      base: parseArray(formData.get("baseNotes") as string),
    };

    const characteristics = parseArray(formData.get("characteristics") as string);
    const occasions = parseArray(formData.get("occasions") as string);
    const seasons = parseArray(formData.get("seasons") as string);
    const images = parseArray(formData.get("images") as string);

    // 4. Insert the Product
    const [newProduct] = await db
      .insert(products)
      .values({
        ...basicData,
        scentNotes,
        characteristics,
        occasions,
        seasons,
        images,
      })
      .returning();

    // 5. Insert the Variants (WITH IMAGE)
    const variantsString = formData.get("variants") as string;
    if (variantsString) {
      const variantsData = JSON.parse(variantsString);
      if (variantsData.length > 0) {
        await db.insert(productVariants).values(
          variantsData.map((v: any) => ({
            productId: newProduct.id,
            size: v.size,
            priceKes: parseInt(v.priceKes),
            stock: parseInt(v.stock),
            sku: v.sku,
            image: v.image || null,
          }))
        );
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { success: false, error: error.message || "Failed to create product." };
  }
}

// --- UPDATE PRODUCT ---
export async function updateProduct(formData: FormData) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_session")?.value !== "authenticated") {
      throw new Error("Unauthorized");
    }

    const productId = formData.get("productId") as string;
    if (!productId) throw new Error("Missing product ID");

    const basicData = createProductSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      brand: formData.get("brand") || undefined,
      category: formData.get("category"),
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription"),
      fragranceFamily: formData.get("fragranceFamily") || undefined,
      isPublished: formData.get("isPublished") === "on",
      isBestseller: formData.get("isBestseller") === "on",
      isNewArrival: formData.get("isNewArrival") === "on",
    });

    const parseArray = (str: string | null) =>
      str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const scentNotes = {
      top: parseArray(formData.get("topNotes") as string),
      heart: parseArray(formData.get("heartNotes") as string),
      base: parseArray(formData.get("baseNotes") as string),
    };

    const characteristics = parseArray(formData.get("characteristics") as string);
    const occasions = parseArray(formData.get("occasions") as string);
    const seasons = parseArray(formData.get("seasons") as string);
    const images = parseArray(formData.get("images") as string);

    // 1. Update the product row
    await db
      .update(products)
      .set({
        ...basicData,
        scentNotes,
        characteristics,
        occasions,
        seasons,
        images,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // 2. Sync variants by matching on SKU (preserves variant IDs for cart stability)
    const variantsString = formData.get("variants") as string;
    const variantsData = variantsString ? JSON.parse(variantsString) : [];

    const existingVariants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId));
    const existingBySku = new Map(existingVariants.map((v) => [v.sku, v]));
    const submittedSkus = new Set<string>();

    for (const v of variantsData) {
      if (existingBySku.has(v.sku)) {
        await db
          .update(productVariants)
          .set({
            size: v.size,
            priceKes: parseInt(v.priceKes),
            stock: parseInt(v.stock),
            image: v.image || null,
          })
          .where(eq(productVariants.id, existingBySku.get(v.sku)!.id));
      } else {
        await db.insert(productVariants).values({
          productId,
          size: v.size,
          priceKes: parseInt(v.priceKes),
          stock: parseInt(v.stock),
          sku: v.sku,
          image: v.image || null,
        });
      }
      submittedSkus.add(v.sku);
    }

    const toDelete = existingVariants.filter((v) => !submittedSkus.has(v.sku));
    if (toDelete.length > 0) {
      await db.delete(productVariants).where(
        inArray(
          productVariants.id,
          toDelete.map((v) => v.id)
        )
      );
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/products/${basicData.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Failed to update product." };
  }
}

// --- QUICK PUBLISH TOGGLE ---
export async function toggleProductPublish(formData: FormData) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("admin_session")?.value !== "authenticated") {
      throw new Error("Unauthorized");
    }

    const productId = formData.get("productId") as string;
    const newState = formData.get("isPublished") === "true";

    await db
      .update(products)
      .set({ isPublished: newState, updatedAt: new Date() })
      .where(eq(products.id, productId));

    revalidatePath("/admin/products");
    revalidatePath("/shop");
  } catch (error: any) {
    console.error("Toggle publish error:", error);
  }
}