import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

// Custom descriptions for the standard collections
const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "Everyday Wear": "Easy, considered scents that sit close and stay polite from morning to evening.",
  "Office": "Clean, composed fragrances that make an impression without filling the room.",
  "Summer": "Bright, airy compositions for warm days and long afternoons.",
  "Date Night": "Warmer, closer, more intimate. Fragrances made to be noticed up close.",
  "Evening": "Deeper, richer scents with presence after dark.",
  "Special Occasions": "Statement fragrances for the moments you want remembered.",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default async function CollectionsPage() {
  // 1. Fetch all published products
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true));

  // 2. Group products by occasion
  const collectionsMap = new Map<string, typeof allProducts>();

  for (const product of allProducts) {
    const occasions = product.occasions || [];
    for (const occasion of occasions) {
      if (!collectionsMap.has(occasion)) {
        collectionsMap.set(occasion, []);
      }
      collectionsMap.get(occasion)!.push(product);
    }
  }

  // Convert map to array for rendering
  const collections = Array.from(collectionsMap.entries()).map(([name, prods]) => ({
    name,
    slug: slugify(name),
    description: COLLECTION_DESCRIPTIONS[name] || `Discover our ${name.toLowerCase()} fragrances.`,
    products: prods,
    count: prods.length,
  }));

  // Sort them to match the order in your screenshot
  const standardOrder = ["Everyday Wear", "Office", "Summer", "Date Night", "Evening", "Special Occasions"];
  collections.sort((a, b) => {
    const indexA = standardOrder.indexOf(a.name);
    const indexB = standardOrder.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      {/* Header */}
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 lg:px-12">
        <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#1a3a2e]/60">
          Collections
        </p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl tracking-tight md:text-7xl lg:text-8xl">
          Discover by mood, moment <br className="hidden md:block" /> & scent.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#1a3a2e]/70">
          Collections overlap — a single fragrance can belong to Office, Everyday and Woody at once. Start wherever feels right.
        </p>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-12">
        {collections.length === 0 ? (
          <p className="py-12 text-center text-[#1a3a2e]/60">No collections found. Add occasions to your products to see them here.</p>
        ) : (
          <div className="grid grid-cols-1 border border-[#1a3a2e]/10 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, i) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className={`group flex flex-col border-b border-[#1a3a2e]/10 transition-colors hover:bg-[#f0eadc]/50 ${
                  // Add right borders to items that aren't on the far right (on desktop)
                  (i + 1) % 3 !== 0 ? "lg:border-r" : ""
                } ${
                  (i + 1) % 2 !== 0 ? "md:border-r lg:border-r" : "md:border-r-0"
                }`}
              >
                {/* Image Collage */}
                <div className="flex h-48 w-full gap-2 overflow-hidden bg-[#f0eadc] p-6">
                  {collection.products.slice(0, 3).map((p, idx) => (
                    <div key={p.id} className="relative h-full flex-1 overflow-hidden bg-[#e8e2d5]">
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Text Content */}
                <div className="flex flex-1 flex-col justify-between p-8">
                  <div>
                    <h2 className="font-serif text-3xl transition-colors group-hover:text-[#d4a84b]">
                      {collection.name}
                    </h2>
                    <p className="mt-4 text-[#1a3a2e]/70">
                      {collection.description}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#1a3a2e]/60 transition-colors group-hover:text-[#1a3a2e]">
                    <span>{collection.count} Fragrances</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}