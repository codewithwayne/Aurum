"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) throw new Error("Invalid password");

      // Redirect to dashboard on success
      router.push("/admin");
      router.refresh(); // Force a refresh so middleware sees the new cookie
    } catch (err) {
      setError("Incorrect password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f6ef] px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl text-[#1a3a2e] text-center mb-8">Admin Access</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#1a3a2e]/20 bg-transparent p-4 text-sm focus:border-[#1a3a2e] focus:outline-none"
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a3a2e] py-4 text-sm uppercase tracking-widest text-[#f9f6ef] hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}