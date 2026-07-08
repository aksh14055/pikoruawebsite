"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Info } from "lucide-react";
import type { ExchangeRates } from "@/lib/exchange-rates";

// Fallback rates as of July 2026 in case API fetch fails
const FALLBACK_EXCHANGE_RATES: Record<string, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 95.1, symbol: "$", label: "US Dollar (USD)" },
  AED: { rate: 25.9, symbol: "AED ", label: "UAE Dirham (AED)" },
  GBP: { rate: 127.3, symbol: "£", label: "British Pound (GBP)" },
  CAD: { rate: 67.2, symbol: "CA$", label: "Canadian Dollar (CAD)" },
  AUD: { rate: 66.0, symbol: "A$", label: "Australian Dollar (AUD)" },
  SGD: { rate: 73.7, symbol: "S$", label: "Singapore Dollar (SGD)" },
};

const PRESET_PRICES = [
  { label: "₹2.5 Crore", value: 25000000 },
  { label: "₹5.0 Crore", value: 50000000 },
  { label: "₹7.5 Crore", value: 75000000 },
  { label: "₹10.0 Crore", value: 100000000 },
];

interface NriCurrencyConverterProps {
  initialRates?: ExchangeRates;
  initialIsLive?: boolean;
}

export function NriCurrencyConverter({ initialRates, initialIsLive = false }: NriCurrencyConverterProps) {
  const [inrAmount, setInrAmount] = useState<number>(50000000); // Default 5 Crore
  const [currency, setCurrency] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (initialRates) return initialRates;
    return {
      USD: FALLBACK_EXCHANGE_RATES.USD.rate,
      AED: FALLBACK_EXCHANGE_RATES.AED.rate,
      GBP: FALLBACK_EXCHANGE_RATES.GBP.rate,
      CAD: FALLBACK_EXCHANGE_RATES.CAD.rate,
      AUD: FALLBACK_EXCHANGE_RATES.AUD.rate,
      SGD: FALLBACK_EXCHANGE_RATES.SGD.rate,
    };
  });
  const [isLive, setIsLive] = useState<boolean>(initialIsLive);

  useEffect(() => {
    async function fetchLiveRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (!res.ok) return;
        const data = await res.json();
        if (data.result === "success" && data.rates) {
          setRates({
            USD: 1 / (data.rates.USD || 0.010521),
            AED: 1 / (data.rates.AED || 0.038637),
            GBP: 1 / (data.rates.GBP || 0.007875),
            CAD: 1 / (data.rates.CAD || 0.014957),
            AUD: 1 / (data.rates.AUD || 0.015165),
            SGD: 1 / (data.rates.SGD || 0.0136),
          });
          setIsLive(true);
        }
      } catch (err) {
        console.error("Failed to fetch live exchange rates client-side:", err);
      }
    }
    // Only fetch client-side if we didn't receive live rates from the server
    if (!initialIsLive) {
      fetchLiveRates();
    }
  }, [initialIsLive]);

  const activeRateInfo = FALLBACK_EXCHANGE_RATES[currency];
  const rateValue = rates[currency] || activeRateInfo.rate;
  const convertedAmount = inrAmount / rateValue;

  // Format currency helper
  const formatHomeCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatInr = (val: number) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore`;
    }
    return `₹ ${(val / 100000).toFixed(2)} Lakh`;
  };


  return (
    <div className="border border-white/[0.08] bg-soft-black/45 rounded-sm p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-lux-black border border-white/[0.08] flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-champagne-gold/85" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-display text-lg text-white uppercase tracking-wide">
                NRI Value & Currency Calculator
              </h3>
              {isLive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-sans font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                  Live Rates
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-sans font-medium bg-champagne-gold/10 text-champagne-gold/80 border border-champagne-gold/20">
                  Advisory Rates
                </span>
              )}
            </div>
            <p className="text-xs text-ivory/50 font-sans mt-0.5">
              Evaluate Ahmedabad property costs in your local currency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Input Section */}
        <div className="space-y-6">
          {/* INR Value Selector */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-wider text-ivory/50 mb-3">
              Property Value (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-champagne-gold/75 font-sans font-medium">
                ₹
              </span>
              <input
                type="number"
                value={inrAmount}
                onChange={(e) => setInrAmount(Math.max(0, Number(e.target.value)))}
                className="w-full bg-lux-black border border-white/[0.08] rounded-sm pl-8 pr-4 py-3 text-sm font-sans text-white focus:border-champagne-gold/60 focus:outline-none focus:ring-1 focus:ring-champagne-gold/30"
                placeholder="Enter value in INR"
              />
            </div>
            {/* Presets */}
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_PRICES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setInrAmount(preset.value)}
                  className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-wider rounded-sm transition-all duration-200 border ${
                    inrAmount === preset.value
                      ? "border-champagne-gold bg-champagne-gold/10 text-champagne-gold"
                      : "border-white/[0.06] bg-lux-black/40 text-ivory/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Local Currency Selector */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-wider text-ivory/50 mb-3">
              Your Home Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-lux-black border border-white/[0.08] rounded-sm px-4 py-3 text-sm font-sans text-white focus:border-champagne-gold/60 focus:outline-none focus:ring-1 focus:ring-champagne-gold/30 appearance-none cursor-pointer"
            >
              {Object.keys(FALLBACK_EXCHANGE_RATES).map((key) => (
                <option key={key} value={key} className="bg-lux-black text-white">
                  {FALLBACK_EXCHANGE_RATES[key].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="bg-lux-black/45 border border-white/[0.04] rounded-sm p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-wider text-ivory/40">
                INR Investment
              </p>
              <p className="font-display text-2xl text-white font-light tracking-wide mt-1">
                {formatInr(inrAmount)}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <p className="text-[10px] font-sans uppercase tracking-wider text-champagne-gold/80">
                Equivalent Home Currency Value
              </p>
              <p className="font-display text-3xl text-champagne-gold font-light tracking-wide mt-1">
                {formatHomeCurrency(convertedAmount)}
              </p>
            </div>


          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-ivory/30 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-ivory/40 font-sans leading-normal">
              Calculations are based on {isLive ? "live mid-market rates" : "typical stable exchange benchmarks"} (1 {currency} = {rateValue.toFixed(2)} INR). Actual market and banking transfer rates will vary.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
