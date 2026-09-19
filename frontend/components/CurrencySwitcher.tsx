"use client";

import React from "react";

export type CurrencyCode = "LKR" | "USD" | "GBP";

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: string; rate: number; name: string }
> = {
  LKR: { symbol: "Rs. ", rate: 1.0, name: "Sri Lankan Rupee (LKR)" },
  USD: { symbol: "$", rate: 1 / 305.0, name: "US Dollar ($)" },
  GBP: { symbol: "£", rate: 0.78 / 305.0, name: "British Pound (£)" },
};

/**
 * Formats any vehicle or simulation amount into authentic Sri Lankan or International currency.
 * Automatically detects whether amount is passed in LKR (millions) or USD.
 */
export function formatCurrency(amount: number, code: CurrencyCode = "LKR"): string {
  if (amount == null || isNaN(amount)) return "Rs. 0";

  // Normalize amount to LKR base
  let lkrAmount = amount;
  if (amount < 1000000 && amount > 0) {
    // Input is in USD, convert to LKR
    lkrAmount = amount * 305.0;
  }

  if (code === "LKR") {
    if (lkrAmount >= 10000000) {
      // 10M+ LKR (100+ Lakhs)
      const millions = (lkrAmount / 1000000).toFixed(1);
      const lakhs = Math.round(lkrAmount / 100000);
      return `Rs. ${millions}M (${lakhs} Lakhs)`;
    } else if (lkrAmount >= 1000000) {
      // 1M - 10M LKR (10 - 100 Lakhs)
      const millions = (lkrAmount / 1000000).toFixed(1);
      const lakhs = Math.round(lkrAmount / 100000);
      return `Rs. ${millions}M (${lakhs} Lakhs)`;
    } else if (lkrAmount >= 100000) {
      const lakhs = (lkrAmount / 100000).toFixed(1);
      return `Rs. ${lakhs} Lakhs`;
    }
    return `Rs. ${Math.round(lkrAmount).toLocaleString()}`;
  }

  if (code === "USD") {
    const usd = lkrAmount / 305.0;
    return `$${Math.round(usd).toLocaleString()}`;
  }

  if (code === "GBP") {
    const gbp = (lkrAmount / 305.0) * 0.78;
    return `£${Math.round(gbp).toLocaleString()}`;
  }

  return `Rs. ${Math.round(lkrAmount).toLocaleString()}`;
}

export function formatCompactCurrency(amount: number, code: CurrencyCode = "LKR"): string {
  let lkrAmount = amount;
  if (amount < 1000000 && amount > 0) {
    lkrAmount = amount * 305.0;
  }

  if (code === "LKR") {
    if (lkrAmount >= 1000000) {
      return `Rs. ${(lkrAmount / 1000000).toFixed(1)}M`;
    }
    return `Rs. ${Math.round(lkrAmount / 100000)} Lakhs`;
  }
  if (code === "USD") {
    return `$${Math.round(lkrAmount / 305.0).toLocaleString()}`;
  }
  return `£${Math.round((lkrAmount / 305.0) * 0.78).toLocaleString()}`;
}

interface CurrencySwitcherProps {
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (code: CurrencyCode) => void;
}

export function CurrencySwitcher({ selectedCurrency, onSelectCurrency }: CurrencySwitcherProps) {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs backdrop-blur-md">
        {(["LKR", "USD", "GBP"] as CurrencyCode[]).map((code) => (
          <button
            key={code}
            onClick={() => onSelectCurrency(code)}
            className={`px-3 py-1.5 rounded-lg font-bold font-mono transition-all duration-200 cursor-pointer ${
              selectedCurrency === code
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {code === "LKR" ? "🇱🇰 LKR" : code}
          </button>
        ))}
      </div>
    </div>
  );
}
