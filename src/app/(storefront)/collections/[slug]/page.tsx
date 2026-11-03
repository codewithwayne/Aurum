import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

// Helper to turn "everyday-wear" back into "Everyday Wear"
function unslugify(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const title = unslugify(slug);
  return { title: `${title} Collection | Aurum Parfums` };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collectionName = unslugify(slug);

  // 1. Fetch all published products
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true));

  // 2. Filter in JS (since occasions is a JSON array in Postgres)
  const collectionProducts = allProducts.filter((p) =>
    (p.occasions || []).includes(collectionName)
  );

  if (collectionProducts.length === 0) {
    notFound();
  }

  // 3. Fetch variants for the cards
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
        <nav className="mb-10 text-xs uppercase tracking-widest text-[#1a3a2e]/50">
          <Link href="/collections" className="hover:text-[#1a3a2e]">Collections</Link>
          <span className="mx-2">/</span>
          <span>{collectionName}</span>
        </nav>

        <h1 className="font-serif text-5xl tracking-tight md:text-7xl">
          {collectionName}
        </h1>
        <p className="mt-4 text-lg text-[#1a3a2e]/70">
          {collectionProducts.length} fragrance{collectionProducts.length === 1 ? "" : "s"} selected for this moment.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] border-t border-[#1a3a2e]/10 px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collectionProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variants={variantsByProduct[p.id] || []}
            />
          ))}
        </div>
      </section>
    </main>
  );
}