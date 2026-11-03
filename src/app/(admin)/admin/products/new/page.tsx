import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
          ← Back to Products
        </Link>
        <h1 className="font-serif text-3xl">Add New Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}