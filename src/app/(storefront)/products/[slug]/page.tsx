import { eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { notFound } from "next/navigation";
import { ProductBuyBox } from "@/components/product/ProductBuyBox";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

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

  // Fetch main variants
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id));

  // Fetch related products (just grabbing others for now, we will refine this later)
  const relatedProducts = await db.select().from(products).where(ne(products.id, product.id)).limit(4);
  const relatedVariants = await db.select().from(productVariants);
  const variantsByProduct = new Map();
  for (const v of relatedVariants) {
    if (!variantsByProduct.has(v.productId)) variantsByProduct.set(v.productId, []);
    variantsByProduct.get(v.productId).push(v);
  }

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-20">
        
        <nav className="mb-10 text-xs uppercase tracking-widest text-[#1a3a2e]/50">
          <Link href="/shop" className="hover:text-[#1a3a2e]">Shop</Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          {/* LEFT: Image Area */}
          <div className="aspect-[4/5] w-full bg-[#e8e2d5] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            {/* Image placeholder */}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col pt-4 lg:pt-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60">{product.brand}</p>
            <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-6 text-lg text-[#1a3a2e]/80">{product.shortDescription}</p>
            
            <ProductBuyBox variants={variants} product={product} />

            {/* Accordions (Native HTML details/summary) */}
            <div className="mt-16 border-t border-[#1a3a2e]/10">
              
              <details className="group border-b border-[#1a3a2e]/10 py-6">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
                  <span>Scent profile</span>
                  <span className="transition group-open:rotate-180">↓</span>
                </summary>
                <div className="pt-4 text-sm text-[#1a3a2e]/70">
                  <p><strong>Family:</strong> {product.fragranceFamily}</p>
                  {product.scentNotes && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div><strong className="text-[#1a3a2e]">Top:</strong><br/>{product.scentNotes.top.join(", ")}</div>
                      <div><strong className="text-[#1a3a2e]">Heart:</strong><br/>{product.scentNotes.heart.join(", ")}</div>
                      <div><strong className="text-[#1a3a2e]">Base:</strong><br/>{product.scentNotes.base.join(", ")}</div>
                    </div>
                  )}
                </div>
              </details>

              <details className="group border-b border-[#1a3a2e]/10 py-6">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
                  <span>How it wears</span>
                  <span className="transition group-open:rotate-180">↓</span>
                </summary>
                <div className="pt-4 text-sm text-[#1a3a2e]/70">
                  <p>{product.fullDescription}</p>
                </div>
              </details>

              <details className="group border-b border-[#1a3a2e]/10 py-6">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
                  <span>Delivery information</span>
                  <span className="transition group-open:rotate-180">↓</span>
                </summary>
                <div className="pt-4 text-sm text-[#1a3a2e]/70">
                  <p>Estimated delivery: 1–2 days in Nairobi, 2–4 days elsewhere in Kenya. Flat rate of KSh 300.</p>
                </div>
              </details>
            </div>
          </div>
        </div>

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
              <ProductCard key={p.id} product={p} variants={variantsByProduct.get(p.id) || []} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}