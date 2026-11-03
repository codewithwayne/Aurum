export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-5xl md:text-6xl">Contact Us</h1>
        <p className="mt-6 text-lg text-[#1a3a2e]/70">
          Have a question about your order, a specific scent, or need help choosing? We're here to help.
        </p>
        
        <div className="mt-12 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1a3a2e]/50 mb-2">Phone / WhatsApp</p>
            <p className="text-xl font-medium">[0704 883 105 / 0725 059 232]</p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1a3a2e]/50 mb-2">Email</p>
            <p className="text-xl font-medium">[aurumparfumske@gmail.com]</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#1a3a2e]/50 mb-2">Instagram</p>
            <a href="#" className="text-xl font-medium underline underline-offset-4 hover:text-[#d4a84b]">
              @aurum.parfums.ke
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}