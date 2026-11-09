"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { customerLogin } from "@/lib/server/customer-actions";

export function CustomerLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await customerLogin(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.refresh(); // Refreshes the page, which will now see the cookie and show the dashboard
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 border border-[#1a3a2e]/10 shadow-sm">
      <h1 className="font-serif text-3xl text-[#1a3a2e] text-center mb-2">View Your Orders</h1>
      <p className="text-center text-sm text-[#1a3a2e]/60 mb-8">
        Enter your phone number and any past order number to access your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1a3a2e]/60 mb-2">Phone Number</label>
          <input
            required
            type="tel"
            name="phone"
            placeholder="0712345678"
            className="w-full border border-[#1a3a2e]/20 bg-transparent p-3 text-sm focus:border-[#1a3a2e] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#1a3a2e]/60 mb-2">Order Number</label>
          <input
            required
            type="text"
            name="orderNumber"
            placeholder="e.g. AU-1234"
            className="w-full border border-[#1a3a2e]/20 bg-transparent p-3 text-sm focus:border-[#1a3a2e] focus:outline-none"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1a3a2e] py-4 text-sm uppercase tracking-widest text-[#f9f6ef] hover:opacity-90 disabled:opacity-50 mt-4"
        >
          {isLoading ? "Verifying..." : "Access Account"}
        </button>
      </form>
    </div>
  );
}