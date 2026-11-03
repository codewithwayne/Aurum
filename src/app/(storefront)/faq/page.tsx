export default function FAQPage() {
  const faqs = [
    {
      q: "What type of fragrances do you sell?",
      a: "We sell premium perfume oils. These are highly concentrated fragrance oils designed to last longer on the skin than traditional eau de parfum."
    },
    {
      q: "How long does delivery take?",
      a: "Within Nairobi, delivery takes up to 4 hours. Outside Nairobi, delivery takes 1-2 business days."
    },
    {
      q: "Can I use my own rider?",
      a: "Yes. During checkout, select 'Arrange Own' delivery. We will waive the delivery fee and you can send an Uber, Bolt, or personal courier."
    },
    {
      q: "How do I know my payment was successful?",
      a: "Once you enter your M-Pesa PIN, the confirmation page will automatically update to show a green 'Payment Received' message. You will also receive an order confirmation."
    },
    {
      q: "What is your return policy?",
      a: "Due to the nature of fragrance products, we do not accept returns on opened items. If you receive a damaged or incorrect item, please contact us within 24 hours."
    }
  ];

  return (
    <main className="min-h-screen bg-[#f9f6ef] text-[#1a3a2e]">
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-serif text-5xl md:text-6xl">Frequently Asked Questions</h1>
        
        <div className="mt-12 divide-y divide-[#1a3a2e]/10 border-t border-[#1a3a2e]/10">
          {faqs.map((faq, index) => (
            <details key={index} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-xl marker:content-none">
                <span>{faq.q}</span>
                <span className="transition group-open:rotate-180">↓</span>
              </summary>
              <p className="mt-4 text-[#1a3a2e]/70">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}