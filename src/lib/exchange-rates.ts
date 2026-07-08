// Exchange rates helper for SSR/ISR fetching

export interface ExchangeRates {
  [key: string]: number;
  USD: number;
  AED: number;
  GBP: number;
  CAD: number;
  AUD: number;
  SGD: number;
}

export const FALLBACK_EXCHANGE_RATES: ExchangeRates = {
  USD: 95.1,
  AED: 25.9,
  GBP: 127.3,
  CAD: 67.2,
  AUD: 66.0,
  SGD: 73.7,
};

export async function getExchangeRates(): Promise<{ rates: ExchangeRates; isLive: boolean }> {
  try {
    // Fetch live currency rates with a 3-second timeout limit to avoid blocking build/render
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache on server for 1 hour
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { rates: FALLBACK_EXCHANGE_RATES, isLive: false };
    }

    const data = await res.json();
    if (data.result === "success" && data.rates) {
      return {
        rates: {
          USD: 1 / (data.rates.USD || 0.010521),
          AED: 1 / (data.rates.AED || 0.038637),
          GBP: 1 / (data.rates.GBP || 0.007875),
          CAD: 1 / (data.rates.CAD || 0.014957),
          AUD: 1 / (data.rates.AUD || 0.015165),
          SGD: 1 / (data.rates.SGD || 0.0136),
        },
        isLive: true,
      };
    }
  } catch (err) {
    console.error("Failed to fetch live exchange rates from server:", err);
  }

  return { rates: FALLBACK_EXCHANGE_RATES, isLive: false };
}
