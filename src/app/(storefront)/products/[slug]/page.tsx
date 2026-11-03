import { eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) return { title: "Product Not Found" };
  return { title: product.seoTitle || product.name, description: product.seoDescription };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product || !product.isPublished) notFound();

  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id));

  const relatedProducts = await db.select().from(products).where(ne(products.id, product.id)).limit(4);
  const relatedVariants = await db.select().from(productVariants);
  
  const variantsByProduct: Record<string, any[]> = {};
  for (const v of relatedVariants) {
    if (!variantsByProduct[v.productId]) variantsByProduct[v.productId] = [];
    variantsByProduct[v.productId].push(v);
  }

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-20">
        
        <nav className="mb-10 text-xs uppercase tracking-widest text-[#1a3a2e]/50">
          <Link href="/shop" className="hover:text-[#1a3a2e]">Shop</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </nav>

        {/* RENDER CLIENT COMPONENT HERE */}
        <ProductDetailClient product={product as any} variants={variants as any} />

        {/* THE IMPRESSION */}
        <div className="mt-32 bg-[#f0eadc] px-6 py-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a3a2e]/50">The Impression</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-tight md:text-5xl">
            {product.shortDescription} A fragrance for {product.occasions?.[0] || "everyday"} — and for being remembered.
          </h2>
        </div>

        {/* YOU MAY ALSO LIKE */}
        <div className="mt-24">
          <h2 className="mb-10 font-serif text-3xl">You may also like</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} variants={variantsByProduct[p.id] || []} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}