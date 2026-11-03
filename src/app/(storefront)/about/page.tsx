import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#1a3a2e]/60">Our Story</p>
        <h1 className="mt-6 font-serif text-5xl md:text-7xl">Smell like money.</h1>
        <p className="mt-8 text-xl leading-relaxed text-[#1a3a2e]/80">
          Aurum Parfums was born from a simple belief: fragrance is more than what you wear. 
          It's the impression you leave behind.
        </p>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden bg-[#e8e2d5]">
            <img 
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop" 
              alt="Aurum Parfums" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-3xl mb-6">Considered fragrances for every mood.</h2>
            <div className="space-y-4 text-[#1a3a2e]/70 leading-relaxed">
              <p>
                We bring together fragrances chosen for presence — scents that become part of your personal style 
                and stay with the people you meet.
              </p>
              <p>
                Every scent in our collection is carefully selected for character, longevity, and the way it 
                evolves on your skin throughout the day.
              </p>
              <p>
                Based in Kenya, we believe that luxury shouldn't be complicated. We offer premium fragrance oils 
                in practical sizes, delivered directly to your door.
              </p>
            </div>
            <div className="mt-12">
              <Link href="/shop" className="bg-[#1a3a2e] px-8 py-4 text-xs uppercase tracking-widest text-[#f9f6ef] hover:opacity-90">
                Explore the collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}