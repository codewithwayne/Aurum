"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/server/admin-actions";
import { ImageUploader } from "./ImageUploader";

type Variant = { size: string; priceKes: string; stock: string; sku: string; image: string };

type InitialProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category: string;
  shortDescription: string;
  fullDescription: string;
  fragranceFamily: string | null;
  scentNotes: { top: string[]; heart: string[]; base: string[] } | null;
  characteristics: string[] | null;
  occasions: string[] | null;
  seasons: string[] | null;
  images: string[];
  isPublished: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  variants: { size: string; priceKes: number; stock: number; sku: string; image: string | null }[];
};

export function ProductForm({ initialData }: { initialData?: InitialProduct }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);

  const [variants, setVariants] = useState<Variant[]>(
    initialData
      ? initialData.variants.map((v) => ({
          size: v.size,
          priceKes: String(v.priceKes),
          stock: String(v.stock),
          sku: v.sku,
          image: v.image || "",
        }))
      : [{ size: "10ml", priceKes: "900", stock: "50", sku: "", image: "" }]
  );

  const addVariant = () =>
    setVariants([...variants, { size: "", priceKes: "", stock: "", sku: "", image: "" }]);
  const removeVariant = (index: number) =>
    setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };
  const removeImage = (indexToRemove: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== indexToRemove));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("variants", JSON.stringify(variants));

      const result = isEdit ? await updateProduct(formData) : await createProduct(formData);

      if (result && result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(result?.error || "Something went wrong");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-24">
      {isEdit && <input type="hidden" name="productId" value={initialData!.id} />}

      {/* BASIC INFO (unchanged) */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-serif text-xl border-b pb-2 mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Product Name</label>
            <input required name="name" defaultValue={initialData?.name} placeholder="e.g. Velvet Oud" className="w-full border p-2 text-sm" onChange={(e) => {
                const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement;
                if (slugInput && !isEdit) {
                  slugInput.value = e.target.value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
                }
              }} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">URL Slug (lowercase)</label>
            <input required name="slug" defaultValue={initialData?.slug} placeholder="e.g. velvet-oud" className="w-full border p-2 text-sm bg-gray-50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Brand (Optional)</label>
            <input name="brand" defaultValue={initialData?.brand || ""} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select name="category" defaultValue={initialData?.category || "women"} className="w-full border p-2 text-sm">
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Short Description</label>
            <input required name="shortDescription" defaultValue={initialData?.shortDescription} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fragrance Family</label>
            <input name="fragranceFamily" defaultValue={initialData?.fragranceFamily || ""} className="w-full border p-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full Description</label>
          <textarea required name="fullDescription" defaultValue={initialData?.fullDescription} rows={4} className="w-full border p-2 text-sm" />
        </div>
      </div>

      {/* SCENT PROFILE (unchanged) */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-serif text-xl border-b pb-2 mb-4">Scent Profile (Comma separated)</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Top Notes</label>
            <input name="topNotes" defaultValue={initialData?.scentNotes?.top.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Heart Notes</label>
            <input name="heartNotes" defaultValue={initialData?.scentNotes?.heart.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Base Notes</label>
            <input name="baseNotes" defaultValue={initialData?.scentNotes?.base.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Characteristics</label>
            <input name="characteristics" defaultValue={initialData?.characteristics?.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Occasions</label>
            <input name="occasions" defaultValue={initialData?.occasions?.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Seasons</label>
            <input name="seasons" defaultValue={initialData?.seasons?.join(", ") || ""} className="w-full border p-2 text-sm" />
          </div>
        </div>
      </div>

      {/* VARIANTS WITH IMAGES */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="font-serif text-xl">Sizes, Prices, Stock & Images</h2>
          <button type="button" onClick={addVariant} className="text-sm bg-gray-100 px-3 py-1 border hover:bg-gray-200">
            + Add Size
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((v, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Size</label>
                  <input required value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)} className="w-full border p-2 text-sm" placeholder="10ml" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Price (KSh)</label>
                  <input required type="number" value={v.priceKes} onChange={(e) => updateVariant(i, "priceKes", e.target.value)} className="w-full border p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stock</label>
                  <input required type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="w-full border p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">SKU</label>
                  <input required value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="w-full border p-2 text-sm" placeholder="AU-VO-10" />
                </div>
              </div>
              
              <div className="w-full md:w-64 flex flex-col gap-2">
                <label className="block text-xs text-gray-500">Variant Image (Optional)</label>
                <div className="flex items-center gap-2">
                  {v.image && <img src={v.image} className="h-10 w-10 object-cover border" />}
                  <ImageUploader onUpload={(url) => updateVariant(i, "image", url)} />
                </div>
              </div>

              <button type="button" onClick={() => removeVariant(i)} className="text-red-600 text-sm p-2 hover:bg-red-50 border border-transparent hover:border-red-200 md:mt-6">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PUBLISHING & MAIN IMAGES */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <h2 className="font-serif text-xl border-b pb-2 mb-4">Main Product Images</h2>
        <div>
          <p className="text-xs text-gray-500 mb-2">These images show on the shop page and as the default image.</p>
          <ImageUploader onUpload={(url) => setImageUrls((prev) => [...prev, url])} />
          <input type="hidden" name="images" value={imageUrls.join(",")} />
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="Uploaded preview" className="h-24 w-24 object-cover border border-gray-200" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-6 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isPublished" defaultChecked={initialData?.isPublished} className="w-4 h-4" /> Published
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isBestseller" defaultChecked={initialData?.isBestseller} className="w-4 h-4" /> Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="isNewArrival" defaultChecked={initialData?.isNewArrival} className="w-4 h-4" /> New Arrival
          </label>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-medium p-4 bg-red-50 border border-red-200">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="bg-[#1a3a2e] text-white px-8 py-3 uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50">
        {isSubmitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}