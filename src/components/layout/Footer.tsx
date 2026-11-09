import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-[#1a3a2e] text-[#f9f6ef]">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
  <img 
    src="/logo.png" 
    alt="Aurum Parfums" 
    className="h-12 w-auto brightness-0 invert" // 'invert' makes a dark logo white for the dark footer
  />
</Link>
            <p className="mt-4 text-sm text-[#f9f6ef]/70">
              Considered fragrances for every mood, moment and occasion. Smell like money.
            </p>
            
            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a84b]">Newsletter</p>
              <form className="mt-4 flex border-b border-[#f9f6ef]/30 pb-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#f9f6ef]/40"
                />
                <button type="submit" className="text-[10px] uppercase tracking-widest text-[#d4a84b] hover:text-white">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a84b]">Shop</p>
            <ul className="mt-6 space-y-4 text-sm text-[#f9f6ef]/80">
              <li><Link href="/shop/women" className="hover:text-white">Women</Link></li>
              <li><Link href="/shop/men" className="hover:text-white">Men</Link></li>
              <li><Link href="/shop/unisex" className="hover:text-white">Unisex</Link></li>
              <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a84b]">Support</p>
            <ul className="mt-6 space-y-4 text-sm text-[#f9f6ef]/80">
              <li><Link href="/contact" className="hover:text-white">Customer support</Link></li>
              <li><Link href="/delivery" className="hover:text-white">Delivery information</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/account" className="hover:text-white">Account</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4a84b]">Contact</p>
            <ul className="mt-6 space-y-4 text-sm text-[#f9f6ef]/80">
              <li>[Phone — 0704 883 105 / 0725 059 232]</li>
              <li>[Email — aurumparfumske@gmail.com]</li>
              <li>Instagram [@aurum.parfums.ke]</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-[#f9f6ef]/20 pt-8 text-xs text-[#f9f6ef]/60 md:flex-row">
          <p>© {new Date().getFullYear()} Aurum Parfums. All rights reserved.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}