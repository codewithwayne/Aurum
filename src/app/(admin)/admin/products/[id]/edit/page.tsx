import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product) notFound();

  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id));

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
          ← Back to Products
        </Link>
        <h1 className="font-serif text-3xl">Edit: {product.name}</h1>
      </div>
      <ProductForm
        initialData={{
          ...product,
          scentNotes: product.scentNotes ?? null,
          characteristics: product.characteristics ?? null,
          occasions: product.occasions ?? null,
          seasons: product.seasons ?? null,
          variants,
        }}
      />
    </div>
  );
}