"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show the sidebar on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Products", href: "/admin/products" },
    { name: "Customers", href: "/admin/customers" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      
      {/* MOBILE TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[#1a3a2e] p-4 text-[#f9f6ef] md:hidden">
        <Link href="/" className="font-serif text-xl">
          Aurum <span className="italic">Admin</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Slides in on mobile, fixed on desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1a3a2e] text-[#f9f6ef] flex flex-col transition-transform duration-300
        md:static md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <Link href="/" className="font-serif text-xl">
            Aurum <span className="italic">Admin</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              className={`block px-4 py-3 text-sm rounded transition-colors ${
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* Added pt-16 for mobile to account for the fixed top bar, and responsive padding */}
      <main className="flex-1 p-4 pt-20 md:p-8 md:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}