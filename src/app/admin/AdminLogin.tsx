"use client";

import { useState } from "react";
import { loginAction } from "./actions";
import { Loader2, Mail, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await loginAction(email, password);
      if (result.success) {
        // Force refresh the page so the Server Component rechecks the cookies
        window.location.reload();
      } else {
        setError(result.error || "Incorrect credentials");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lux-black flex items-center justify-center p-4 selection:bg-champagne-gold/20 selection:text-white">
      {/* Background soft glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-champagne-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-soft-black border border-white/[0.06] rounded-lg p-8 sm:p-10 relative z-10 shadow-2xl">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-px bg-champagne-gold/50 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-normal tracking-[0.2em] text-ivory uppercase">
            PIKORUA
          </h1>
          <p className="text-[10px] font-sans text-champagne-gold uppercase tracking-[0.25em] mt-1.5 font-medium">
            Private Advisory Console
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-[10px] font-sans text-ivory/50 uppercase tracking-[0.15em]"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                disabled={isLoading}
                className="w-full bg-lux-black border border-white/[0.08] focus:border-champagne-gold text-ivory text-sm px-4 py-3 pl-10 rounded-sm focus:outline-none focus:ring-1 focus:ring-champagne-gold/30 transition-all font-sans placeholder-white/20"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-[10px] font-sans text-ivory/50 uppercase tracking-[0.15em]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                className="w-full bg-lux-black border border-white/[0.08] focus:border-champagne-gold text-ivory text-sm px-4 py-3 pl-10 rounded-sm focus:outline-none focus:ring-1 focus:ring-champagne-gold/30 transition-all font-sans placeholder-white/20"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/20" />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-200 text-xs py-2.5 px-3 rounded-sm font-sans flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-champagne-gold hover:bg-antique-gold disabled:bg-champagne-gold/45 text-lux-black disabled:text-lux-black/60 font-sans font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-champagne-gold/10"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Access Console"
            )}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/[0.04]">
          <p className="text-[9px] font-sans text-ivory/30 uppercase tracking-wider">
            Secured Connection • IP Logged
          </p>
        </div>
      </div>
    </div>
  );
}

