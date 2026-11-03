import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { toggleProductPublish } from "@/lib/server/admin-actions";

export default async function AdminProductsPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const allVariants = await db.select().from(productVariants);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Products</h1>
        <Link 
          href="/admin/products/new"
          className="bg-[#1a3a2e] text-white px-6 py-3 uppercase tracking-widest text-xs hover:opacity-90"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Variants</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allProducts.map((product) => {
              const variants = allVariants.filter(v => v.productId === product.id);
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1a3a2e]">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.slug}</p>
                  </td>
                  <td className="px-6 py-4 capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-xs">
                    {variants.map(v => `${v.size} (${v.stock} left)`).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      product.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
  <div className="flex justify-end gap-3">
    <form action={toggleProductPublish}>
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="isPublished" value={String(!product.isPublished)} />
      <button type="submit" className={`text-xs px-3 py-1 border transition-colors ${
        product.isPublished 
          ? "border-gray-300 text-gray-600 hover:bg-gray-100" 
          : "border-[#1a3a2e] text-[#1a3a2e] hover:bg-[#1a3a2e] hover:text-white"
      }`}>
        {product.isPublished ? "Unpublish" : "Publish"}
      </button>
    </form>
    <Link 
      href={`/admin/products/${product.id}/edit`}
      className="text-sm font-medium underline text-[#1a3a2e] hover:text-black"
    >
      Edit
    </Link>
  </div>
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}