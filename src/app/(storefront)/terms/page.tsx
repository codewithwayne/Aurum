export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-4xl md:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-[#1a3a2e]/60">Last updated: {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
        
        <div className="mt-12 space-y-8 text-[#1a3a2e]/80 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">1. Overview</h2>
            <p>By visiting our website and purchasing from Aurum Parfums, you agree to the following terms and conditions. Our store operates in Kenya and all prices are displayed in Kenyan Shillings (KSh).</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">2. Orders and Payments</h2>
            <p>By placing an order, you agree to provide accurate and complete contact and delivery information. Orders are only confirmed and dispatched once payment has been successfully received and verified via M-Pesa. We reserve the right to cancel any order due to stock unavailability or suspected fraud.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">3. Delivery</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Standard Delivery:</strong> We offer a flat rate of KSh 300. Deliveries within Nairobi are targeted within 4 hours. Deliveries outside Nairobi take 1-2 business days.</li>
              <li><strong>Arrange Own Delivery:</strong> You may choose to arrange your own courier (e.g., Uber, Bolt). In this case, the delivery fee is waived, but Aurum Parfums is not responsible for items once they are handed over to your designated rider.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">4. Returns and Refunds</h2>
            <p>Due to the hygienic nature of fragrance and cosmetic products, we do not accept returns or offer refunds on opened products. If you receive a damaged or incorrect item, please contact us within 24 hours of delivery with photo evidence, and we will arrange a replacement or refund.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">5. Product Descriptions</h2>
            <p>We strive to describe our fragrances accurately. However, scent perception is subjective and varies from person to person. Please refer to our size options (e.g., 10ml) if you wish to try a fragrance before committing to a larger bottle.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">6. Contact</h2>
            <p>For any questions regarding these terms, please reach out to us via the information provided on our Contact page.</p>
          </div>
        </div>
      </section>
    </main>
  );
}