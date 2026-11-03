import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { ShopClient } from "@/components/product/ShopClient";

export default async function SearchPage() {
  // 1. Fetch all published products (same as the shop page)
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true));

  const allVariants = await db.select().from(productVariants);

  const variantsByProduct: Record<string, typeof allVariants> = {};
  for (const v of allVariants) {
    if (!variantsByProduct[v.productId]) {
      variantsByProduct[v.productId] = [];
    }
    variantsByProduct[v.productId].push(v);
  }

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 lg:px-12">
        <h1 className="font-serif text-5xl md:text-7xl">Search</h1>
        <p className="mt-4 text-lg text-[#1a3a2e]/70">
          Find your next signature scent by name, brand, or note.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] border-t border-[#1a3a2e]/10 px-6 py-12 lg:px-12">
        {/* We reuse the ShopClient, but without the sidebar filters */}
        <ShopClient 
          initialProducts={allProducts} 
          variantsByProduct={variantsByProduct} 
        />
      </section>
    </main>
  );
}