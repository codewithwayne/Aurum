import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { ProductCard } from "@/components/product/ProductCard";

export default async function HomePage() {
  // 1. Fetch all published products
  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.isPublished, true))
    .orderBy(desc(products.createdAt));

  // 2. Fetch variants
  const allVariants = await db.select().from(productVariants);

  // 3. Group variants by product
  const variantsByProduct: Record<string, typeof allVariants> = {};
  for (const v of allVariants) {
    if (!variantsByProduct[v.productId]) {
      variantsByProduct[v.productId] = [];
    }
    variantsByProduct[v.productId].push(v);
  }

  // 4. Filter for Bestsellers (fallback to first 4 if none marked)
  const bestsellers = allProducts.filter((p) => p.isBestseller).slice(0, 4);
  const displayBestsellers = bestsellers.length > 0 ? bestsellers : allProducts.slice(0, 4);

  // 5. Signature Collection (just grabbing the next 3 products)
  const signatureCollection = allProducts.slice(4, 7);
  const displaySignature = signatureCollection.length > 0 ? signatureCollection : allProducts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2000&auto=format&fit=crop"
          alt="Aurum Parfums Hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay for text readability */}
        
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 lg:px-12">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4a84b]">
            Aurum Parfums
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-6xl leading-tight text-white md:text-7xl lg:text-8xl">
            Find your <br /> <span className="italic">signature.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/90">
            Considered fragrances for every mood, moment and occasion. Smell like money.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link 
              href="/shop" 
              className="bg-[#d4a84b] px-8 py-4 text-xs font-medium uppercase tracking-widest text-[#1a3a2e] transition-colors hover:bg-[#c2963a]"
            >
              Explore the collection
            </Link>
            <Link 
              href="/shop?search=" 
              className="text-sm font-medium text-white underline decoration-white/50 underline-offset-8 transition-colors hover:decoration-white"
            >
              Discover your scent
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-serif text-4xl md:text-5xl">Shop by category</h2>
          <Link href="/shop" className="hidden text-sm underline underline-offset-4 hover:text-[#d4a84b] sm:block">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Women */}
          <Link href="/shop?category=women" className="group relative aspect-[4/5] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop" 
              alt="Women's Fragrances" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl text-white">Women</h3>
            </div>
          </Link>
          
          {/* Men */}
          <Link href="/shop?category=men" className="group relative aspect-[4/5] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop" 
              alt="Men's Fragrances" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl text-white">Men</h3>
            </div>
          </Link>
          
          {/* Unisex */}
          <Link href="/shop?category=unisex" className="group relative aspect-[4/5] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop" 
              alt="Unisex Fragrances" 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl text-white">Unisex</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. DISCOVER BY MOOD */}
      <section className="border-y border-[#1a3a2e]/10 bg-[#f0eadc] py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60">Discover by mood</p>
            <h2 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">
              Find your kind of fragrance
            </h2>
            <p className="mt-6 max-w-md text-lg text-[#1a3a2e]/70">
              Not sure what you're looking for? Start with a feeling, a moment or a scent you already love.
            </p>
          </div>
          
          <div className="flex flex-col">
            {[
              { num: "01", title: "Everyday", desc: "Close, easy, yours.", link: "/shop?occasion=Everyday+Wear" },
              { num: "02", title: "Fresh", desc: "Citrus, air and light.", link: "/shop?family=Fresh" },
              { num: "03", title: "Sweet", desc: "Vanilla, musk, warmth.", link: "/shop?family=Sweet" },
              { num: "04", title: "Date Night", desc: "Made to be noticed up close.", link: "/shop?occasion=Date+Night" },
              { num: "05", title: "Evening", desc: "Deeper after dark.", link: "/shop?occasion=Evening" },
            ].map((item) => (
              <Link 
                key={item.title} 
                href={item.link}
                className="group flex items-center justify-between border-b border-[#1a3a2e]/10 py-8 transition-colors hover:border-[#1a3a2e]/30"
              >
                <div className="flex items-center gap-8">
                  <span className="text-xs text-[#1a3a2e]/40">{item.num}</span>
                  <h3 className="font-serif text-3xl group-hover:text-[#d4a84b] transition-colors">{item.title}</h3>
                </div>
                <div className="hidden items-center gap-4 sm:flex">
                  <span className="text-sm text-[#1a3a2e]/60">{item.desc}</span>
                  <span className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BESTSELLERS */}
      {displayBestsellers.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-12">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60 mb-2">Most loved</p>
              <h2 className="font-serif text-4xl md:text-5xl">Bestsellers</h2>
            </div>
            <Link href="/shop" className="text-sm underline underline-offset-4 hover:text-[#d4a84b]">
              Shop all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {displayBestsellers.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                variants={variantsByProduct[p.id] || []}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. OUR STORY */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[60vh] lg:h-auto">
          <img
            src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1500&auto=format&fit=crop"
            alt="Applying perfume"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center bg-[#f9f6ef] px-6 py-24 lg:px-24">
          <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60 mb-8">Our Story</p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            “Fragrance is more than what you wear. It's the impression you leave behind.”
          </h2>
          <p className="mt-8 max-w-lg text-lg text-[#1a3a2e]/70">
            Aurum Parfums brings together fragrances chosen for presence — scents that become part of your personal style and stay with the people you meet.
          </p>
          <div className="mt-12">
            <Link 
              href="/about" 
              className="border-b border-[#1a3a2e] pb-1 text-sm font-medium tracking-wide transition-colors hover:text-[#d4a84b] hover:border-[#d4a84b]"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* 6. THE SIGNATURE COLLECTION */}
      {displaySignature.length > 0 && (
        <section className="bg-[#1a3a2e] py-24 text-[#f9f6ef]">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4a84b]">The Signature Collection</p>
            <h2 className="mt-4 font-serif text-5xl md:text-7xl">Statements, bottled.</h2>
            
            <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
              {displaySignature.map((p) => {
                const variants = variantsByProduct[p.id] || [];
                const minPrice = variants.length > 0 ? Math.min(...variants.map(v => v.priceKes)) : null;
                return (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group flex items-center gap-6">
                    <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#2a4d3e]">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#f9f6ef]/60">{p.brand || "Aurum Parfums"}</p>
                      <h3 className="mt-1 font-serif text-2xl">{p.name}</h3>
                      {minPrice && (
                        <p className="mt-1 text-sm text-[#f9f6ef]/80">from KSh {minPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}