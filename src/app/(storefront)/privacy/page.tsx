export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-4xl md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-[#1a3a2e]/60">Last updated: {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
        
        <div className="mt-12 space-y-8 text-[#1a3a2e]/80 leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">1. Information We Collect</h2>
            <p>When you place an order with Aurum Parfums, we collect the following information:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Personal Data:</strong> Your name, phone number, and email address (if provided).</li>
              <li><strong>Delivery Data:</strong> Your physical address, estate, building, and any delivery instructions you provide.</li>
              <li><strong>Transaction Data:</strong> Details about the products you purchased and the total amount paid.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">2. How We Use Your Information</h2>
            <p>We use your information strictly to fulfill your orders and improve your experience. This includes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Processing and delivering your orders.</li>
              <li>Communicating with you about your order status.</li>
              <li>Providing customer support.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">3. Payments & Security</h2>
            <p>We do not store your M-Pesa PIN or any sensitive financial details. All payments are processed securely through <strong>PayHero</strong> and Safaricom's M-Pesa infrastructure. Your payment data is handled directly by these providers.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">4. Third-Party Services</h2>
            <p>We share necessary data with trusted third parties to operate our store:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Neon (Database):</strong> Securely stores your order and delivery details.</li>
              <li><strong>Vercel (Hosting):</strong> Hosts this website.</li>
              <li><strong>Cloudflare (Storage):</strong> Hosts our product images.</li>
              <li><strong>Resend (Email):</strong> Sends order confirmations if you provide an email address.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#1a3a2e] mb-3">5. Your Rights</h2>
            <p>You have the right to request access to the personal data we hold about you, or request that it be deleted. To do so, please contact us using the details on our Contact page.</p>
          </div>
        </div>
      </section>
    </main>
  );
}