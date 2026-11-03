export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-5xl md:text-6xl">Delivery Information</h1>
        
        <div className="mt-12 space-y-8 text-[#1a3a2e]/80">
          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-2">Nairobi</h2>
            <p>Within Nairobi, delivery is completed within <strong>4 hours</strong> of order confirmation. Delivery fee is KSh 300.</p>
          </div>
          
          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-2">Outside Nairobi</h2>
            <p>Deliveries outside Nairobi typically arrive within <strong>1–2 business days</strong>. Delivery fee is KSh 300.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-2">Arrange Your Own Courier</h2>
            <p>If you prefer, you can arrange your own delivery (e.g., Uber, Bolt, or a personal courier). With this option, the delivery fee is waived (KSh 0), and you coordinate directly with the rider to pick up from our location.</p>
          </div>
        </div>
      </section>
    </main>
  );
}