"use client";

import React, { useState } from "react";
import { DollarSignIcon, SparklesIcon } from "./Icons";
import { CurrencyCode, formatCurrency } from "./CurrencySwitcher";

interface TCOTimelineItem {
  year: number;
  resale_value: number;
  depreciation_loss: number;
  fuel_cost: number;
  maintenance_cost: number;
  insurance_cost: number;
  loan_interest_cost: number;
  net_tco: number;
}

interface TCOData {
  vehicle_id: string;
  model_name: string;
  purchase_price: number;
  holding_period_years: number;
  annual_km: number;
  estimated_fuel_cost: number;
  estimated_maintenance_cost: number;
  estimated_insurance_cost: number;
  estimated_depreciation: number;
  estimated_resale_value: number;
  total_ownership_cost: number;
  monthly_effective_cost: number;
  timeline: TCOTimelineItem[];
  disclaimer?: string;
}

interface TCOChartProps {
  nowTco?: TCOData;
  futureTco?: TCOData;
  currency: CurrencyCode;
}

export function TCOChart({ nowTco, futureTco, currency }: TCOChartProps) {
  const [selectedMode, setSelectedMode] = useState<"now" | "future">("now");

  const activeTco = selectedMode === "now" ? nowTco : futureTco;

  if (!activeTco) return null;

  const years = activeTco.holding_period_years || 5;

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-8 rounded-3xl bg-[#0d131f]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/[0.08]">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <DollarSignIcon className="w-3.5 h-3.5" /> 5-Year Cost Breakdown
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            What Does This Car Really Cost?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Not just the sticker price! Here is what you will actually spend over {years} years.
          </p>
        </div>

        {/* Model Switcher */}
        {futureTco && nowTco && nowTco.vehicle_id !== futureTco.vehicle_id && (
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.05] border border-white/10 shrink-0">
            <button
              onClick={() => setSelectedMode("now")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedMode === "now"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🏆 Top Match
            </button>
            <button
              onClick={() => setSelectedMode("future")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedMode === "future"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👶 Future Alternative
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <span>🚗</span>
          <span>{activeTco.model_name}</span>
        </h4>
      </div>

      {/* 4 Super Simple Cost Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* 1. Price */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-2xl mb-1">🏷️</div>
          <div className="text-xs text-slate-400">Car Price</div>
          <div className="text-base sm:text-lg font-extrabold text-white font-mono mt-1">
            {formatCurrency(activeTco.purchase_price, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Initial purchase</div>
        </div>

        {/* 2. Fuel */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-2xl mb-1">⛽</div>
          <div className="text-xs text-slate-400">{years}-Year Fuel Cost</div>
          <div className="text-base sm:text-lg font-extrabold text-amber-400 font-mono mt-1">
            {formatCurrency(activeTco.estimated_fuel_cost, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Daily commute energy</div>
        </div>

        {/* 3. Maintenance */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-2xl mb-1">🔧</div>
          <div className="text-xs text-slate-400">{years}-Year Service</div>
          <div className="text-base sm:text-lg font-extrabold text-blue-400 font-mono mt-1">
            {formatCurrency(activeTco.estimated_maintenance_cost, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Regular checkups</div>
        </div>

        {/* 4. Resale Value */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="text-2xl mb-1">🔄</div>
          <div className="text-xs text-slate-400">Money Back (Resale)</div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono mt-1">
            + {formatCurrency(activeTco.estimated_resale_value, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Estimated selling value</div>
        </div>
      </div>

      {/* Big Highlight: Net Total 5-Year Ownership Cost */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-1">
            🎯 The Real Bottom Line
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            {formatCurrency(activeTco.total_ownership_cost, currency)}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Total cost you actually lose over {years} years after getting your resale money back.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center shrink-0 w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 block mb-0.5">Effective Monthly Cost</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(activeTco.monthly_effective_cost, currency)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">per month</span>
        </div>
      </div>
    </div>
  );
}
