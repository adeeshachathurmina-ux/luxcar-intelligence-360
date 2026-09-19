"use client";

import React from "react";
import { CurrencyCode } from "./CurrencySwitcher";
import { SparklesIcon, CarIcon } from "./Icons";
import { soundFX } from "./AudioEffects";

export interface SimpleParams {
  budget: number;
  family_size: number;
  daily_km: number;
  preferred_body_type: string;
  fuel_pref: string;
  future_family_size: number;
  future_daily_km: number;
}

interface SimpleControlsProps {
  params: SimpleParams;
  onChange: (updated: SimpleParams) => void;
  onSimulate: () => void;
  loading: boolean;
  currency: CurrencyCode;
}

export function SimpleControls({
  params,
  onChange,
  onSimulate,
  loading,
  currency,
}: SimpleControlsProps) {
  const isLkr = currency === "LKR";

  // Helper to format budget label
  const formatBudgetDisplay = (amount: number) => {
    if (isLkr) {
      const millions = amount / 1000000;
      const lakhs = amount / 100000;
      return `Rs. ${millions.toFixed(1)} Million (${lakhs.toFixed(0)} Lakhs)`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Quick Preset Handlers
  const applyPreset = (type: "solo" | "small_family" | "big_family" | "eco") => {
    soundFX.playChime();
    if (type === "solo") {
      onChange({
        ...params,
        budget: isLkr ? 12000000 : 40000,
        family_size: 2,
        daily_km: 20,
        preferred_body_type: "Sedan",
        fuel_pref: "Petrol",
        future_family_size: 3,
        future_daily_km: 30,
      });
    } else if (type === "small_family") {
      onChange({
        ...params,
        budget: isLkr ? 20000000 : 65000,
        family_size: 4,
        daily_km: 35,
        preferred_body_type: "SUV",
        fuel_pref: "Hybrid",
        future_family_size: 5,
        future_daily_km: 45,
      });
    } else if (type === "big_family") {
      onChange({
        ...params,
        budget: isLkr ? 35000000 : 110000,
        family_size: 7,
        daily_km: 45,
        preferred_body_type: "SUV",
        fuel_pref: "any",
        future_family_size: 7,
        future_daily_km: 60,
      });
    } else if (type === "eco") {
      onChange({
        ...params,
        budget: isLkr ? 16000000 : 55000,
        family_size: 5,
        daily_km: 40,
        preferred_body_type: "all",
        fuel_pref: "Electric",
        future_family_size: 5,
        future_daily_km: 50,
      });
    }
  };

  // Budget Quick-Pick options
  const budgetOptions = isLkr
    ? [
        { label: "Rs. 10M (100 Lakhs)", value: 10000000 },
        { label: "Rs. 18M (180 Lakhs)", value: 18000000 },
        { label: "Rs. 30M (300 Lakhs)", value: 30000000 },
        { label: "Rs. 50M+ (Luxury)", value: 50000000 },
      ]
    : [
        { label: "$35,000", value: 35000 },
        { label: "$60,000", value: 60000 },
        { label: "$95,000", value: 95000 },
        { label: "$150,000+", value: 150000 },
      ];

  const minBudget = isLkr ? 5000000 : 25000;
  const maxBudget = isLkr ? 75000000 : 220000;
  const stepBudget = isLkr ? 500000 : 2500;

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-[#0d131f]/90 border border-white/10 shadow-2xl backdrop-blur-xl transition-all">
      {/* Step Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <SparklesIcon className="w-3.5 h-3.5" /> Super Simple Car Finder
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Tell Us What You Need in 4 Easy Steps
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          No complicated questions! Choose your budget and lifestyle to find your ideal car instantly.
        </p>
      </div>

      {/* 1. Quick Presets Bar */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
          ⚡ Quick 1-Click Setups:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset("solo")}
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-xl mb-1">👤</div>
            <div className="text-xs font-bold text-white">Single / Daily</div>
            <div className="text-[10px] text-slate-400">2 Seats • City Daily</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("small_family")}
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-xl mb-1">👨‍👩‍👧</div>
            <div className="text-xs font-bold text-white">Small Family</div>
            <div className="text-[10px] text-slate-400">4-5 Seats • SUV/Hybrid</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("big_family")}
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-xl mb-1">🚐</div>
            <div className="text-xs font-bold text-white">Big Family</div>
            <div className="text-[10px] text-slate-400">7 Seats • Road Trips</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset("eco")}
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="text-xl mb-1">⚡</div>
            <div className="text-xs font-bold text-white">Eco & Electric</div>
            <div className="text-[10px] text-slate-400">Zero Petrol • Low Cost</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Step 1: Budget */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-extrabold">1</span>
              💰 What is Your Budget?
            </span>
          </div>

          <div className="text-xl font-extrabold text-blue-400 mb-3 font-mono">
            {formatBudgetDisplay(params.budget)}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={minBudget}
            max={maxBudget}
            step={stepBudget}
            value={params.budget}
            onChange={(e) => {
              onChange({ ...params, budget: Number(e.target.value) });
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
          />

          {/* Quick-Pick Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {budgetOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onChange({ ...params, budget: opt.value });
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  params.budget === opt.value
                    ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Family Size & Seats */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-extrabold">2</span>
              👨‍👩‍👧‍👦 How Many Seats Do You Need?
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Choose the number of people traveling with you:
          </p>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "2 Seats", desc: "Just Me / Couple", count: 2, icon: "👤" },
              { label: "5 Seats", desc: "Standard Family", count: 5, icon: "👨‍👩‍👦" },
              { label: "7 Seats", desc: "Big Family / 3-Row", count: 7, icon: "🚐" },
            ].map((s) => (
              <button
                key={s.count}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onChange({
                    ...params,
                    family_size: s.count,
                    future_family_size: Math.max(s.count, params.future_family_size),
                  });
                }}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  params.family_size === s.count
                    ? "bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400 scale-[1.02]"
                    : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs font-bold">{s.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Quick future expansion checkbox */}
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer">
            <input
              type="checkbox"
              checked={params.future_family_size > params.family_size}
              onChange={(e) => {
                soundFX.playClick();
                onChange({
                  ...params,
                  future_family_size: e.target.checked
                    ? params.family_size + 2
                    : params.family_size,
                });
              }}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-300">
              👶 Planning to expand family in 3 years? (+ extra space)
            </span>
          </label>
        </div>

        {/* Step 3: Daily Driving Distance */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-extrabold">3</span>
              🚗 Daily Driving Distance
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {params.daily_km} km / day
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {[
              { label: "Short", dist: 15, desc: "Office / School", icon: "🏢" },
              { label: "Medium", dist: 35, desc: "Daily City Commute", icon: "🚗" },
              { label: "Long", dist: 70, desc: "Highways & Long Runs", icon: "🛣️" },
            ].map((d) => (
              <button
                key={d.dist}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onChange({ ...params, daily_km: d.dist });
                }}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                  params.daily_km === d.dist
                    ? "bg-emerald-600/30 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400 scale-[1.02]"
                    : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <div className="text-xl mb-1">{d.icon}</div>
                <div className="text-xs font-bold">{d.label} ({d.dist}km)</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>

          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={params.daily_km}
            onChange={(e) => {
              onChange({ ...params, daily_km: Number(e.target.value) });
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Step 4: Car Style & Fuel */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-extrabold">4</span>
              🚙 Vehicle Style & Fuel
            </span>
          </div>

          {/* Body Type */}
          <div className="mb-3">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Body Style:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "All Styles", value: "all", icon: "🌟" },
                { label: "SUV", value: "SUV", icon: "🚙" },
                { label: "Sedan", value: "Sedan", icon: "🏎️" },
              ].map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onChange({ ...params, preferred_body_type: b.value });
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    params.preferred_body_type === b.value
                      ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold scale-[1.02]"
                      : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Fuel Engine Preference:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "Any", value: "any", icon: "🌈" },
                { label: "Petrol", value: "Petrol", icon: "⛽" },
                { label: "Hybrid", value: "Hybrid", icon: "🌿" },
                { label: "Electric", value: "Electric", icon: "⚡" },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onChange({ ...params, fuel_pref: f.value });
                  }}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-medium border text-center transition cursor-pointer ${
                    params.fuel_pref.toLowerCase() === f.value.toLowerCase()
                      ? "bg-blue-600 text-white border-blue-400 font-bold shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]"
                  }`}
                >
                  <div>{f.icon}</div>
                  <div>{f.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Big Action Button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => {
            soundFX.playEngineRev();
            onSimulate();
          }}
          disabled={loading}
          className="relative group w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-blue-500/30 border border-blue-400/30 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching Best Matches...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CarIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              Find My Perfect Car Now 🏎️💨
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
