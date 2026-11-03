import { Suspense } from "react";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { ShopClient } from "@/components/product/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt));

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
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#1a3a2e]/60">
          The Catalogue
        </p>
        <h1 className="mt-4 font-serif text-6xl tracking-tight md:text-7xl lg:text-8xl">
          All fragrances
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[#1a3a2e]/70">
          Every scent in the house, chosen for character and presence. Browse by
          category, or narrow by family, occasion and size.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] border-t border-[#1a3a2e]/10 px-6 py-12 lg:px-12">
        <Suspense fallback={<p className="text-[#1a3a2e]/60">Loading catalogue...</p>}>
          <ShopClient
            initialProducts={allProducts}
            variantsByProduct={variantsByProduct}
          />
        </Suspense>
      </section>
    </main>
  );
}