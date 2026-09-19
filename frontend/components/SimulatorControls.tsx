"use client";

import React, { useState } from "react";
import { SlidersIcon, UsersIcon, GaugeIcon, DollarSignIcon, CarIcon, TrendingUpIcon, ShieldCheckIcon, ZapIcon } from "./Icons";
import { CurrencyCode, formatCurrency, formatCompactCurrency } from "./CurrencySwitcher";

export interface CurrentParams {
  budget: number;
  family_size: number;
  daily_km: number;
  priority_pref: number;
  preferred_body_type: string;
  fuel_pref: string;
  holding_years: number;
  down_payment_pct: number;
  loan_interest_apr: number;
  loan_term_months: number;
}

export interface FutureParams {
  planning_years: number;
  family_size: number;
  daily_km: number;
  preferred_body_type: string;
  expected_usage: string;
}

export interface CustomWeights {
  budget: number;
  family: number;
  comfort: number;
  performance: number;
  efficiency: number;
}

interface SimulatorControlsProps {
  current: CurrentParams;
  future: FutureParams;
  customWeights: CustomWeights;
  currency: CurrencyCode;
  onChangeCurrent: (params: Partial<CurrentParams>) => void;
  onChangeFuture: (params: Partial<FutureParams>) => void;
  onChangeWeights: (weights: Partial<CustomWeights>) => void;
  onResetWeights: () => void;
  onSimulate: () => void;
  loading: boolean;
}

export function SimulatorControls({
  current,
  future,
  customWeights,
  currency,
  onChangeCurrent,
  onChangeFuture,
  onChangeWeights,
  onResetWeights,
  onSimulate,
  loading,
}: SimulatorControlsProps) {
  const [activeMode, setActiveMode] = useState<"simple" | "advanced">("simple");

  const isLKR = currency === "LKR" || current.budget > 1000000;

  // Sri Lankan price benchmarks (in LKR)
  const lkrBenchmarks = [
    { label: "Wagon R", amount: 6800000, display: "68L (6.8M)" },
    { label: "Vezel", amount: 14800000, display: "148L (14.8M)" },
    { label: "Premio", amount: 16500000, display: "165L (16.5M)" },
    { label: "Benz C", amount: 24500000, display: "245L (24.5M)" },
    { label: "BMW 3", amount: 34000000, display: "340L (34M)" },
    { label: "GLC", amount: 48000000, display: "480L (48M)" },
    { label: "Prado", amount: 72000000, display: "720L (72M)" },
  ];

  const minBudget = isLKR ? 5000000 : 15000;
  const maxBudget = isLKR ? 95000000 : 320000;
  const budgetStep = isLKR ? 500000 : 2500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl glow-sapphire border-t-2 border-t-blue-500">
        {/* Mode Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <SlidersIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Lifestyle & Simulation Controls
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure your vehicle purchase budget, travel patterns, and comfort priorities.
            </p>
          </div>

          {/* Mode Switch Pills */}
          <div className="inline-flex items-center p-1 bg-[#090d16] border border-white/10 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveMode("simple")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === "simple"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🟢 Simple & Intuitive</span>
            </button>
            <button
              onClick={() => setActiveMode("advanced")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeMode === "advanced"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>🟣 Data Science Mode</span>
            </button>
          </div>
        </div>

        {/* ================= SIMPLE MODE (4 FRIENDLY CARDS) ================= */}
        {activeMode === "simple" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 1. BUDGET */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <DollarSignIcon className="w-3.5 h-3.5" />
                      <span>Available Budget</span>
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {formatCurrency(current.budget, currency)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step={budgetStep}
                    value={current.budget}
                    onChange={(e) => onChangeCurrent({ budget: parseFloat(e.target.value) })}
                    className="w-full my-3"
                  />
                </div>

                {/* Quick Sri Lankan Benchmark Pills */}
                {isLKR && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-slate-400 block mb-1">Common SL Budgets:</span>
                    <div className="flex flex-wrap gap-1">
                      {lkrBenchmarks.slice(0, 4).map((b) => (
                        <button
                          key={b.label}
                          onClick={() => onChangeCurrent({ budget: b.amount })}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition cursor-pointer font-mono ${
                            Math.abs(current.budget - b.amount) < 1000000
                              ? "bg-blue-600 text-white border-blue-400"
                              : "bg-white/[0.03] text-slate-400 border-white/5 hover:text-white"
                          }`}
                        >
                          {b.label}: {b.display}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. FAMILY / PASSENGER CAPACITY */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5" />
                      <span>Passengers / Family</span>
                    </span>
                    <span className="text-xs font-mono text-white font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {current.family_size} Seats Needed
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-2">
                    {[
                      { count: 2, label: "Couple (2)", icon: "👤" },
                      { count: 4, label: "Family (4)", icon: "👨‍👩‍👧" },
                      { count: 5, label: "Spacious (5+)", icon: "👨‍👩‍👧‍👦" },
                    ].map((item) => (
                      <button
                        key={item.count}
                        onClick={() => onChangeCurrent({ family_size: item.count })}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          current.family_size === item.count
                            ? "bg-cyan-600/30 text-white border-cyan-400 shadow-md shadow-cyan-500/20"
                            : "bg-white/[0.02] text-slate-400 border-white/5 hover:text-white"
                        }`}
                      >
                        <div className="text-base mb-1">{item.icon}</div>
                        <div className="text-[11px] font-bold">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2">
                  Affects minimum seating requirement & boot luggage volume scoring.
                </p>
              </div>

              {/* 3. DAILY COMMUTE (KM) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <GaugeIcon className="w-3.5 h-3.5" />
                      <span>Daily Commute</span>
                    </span>
                    <span className="text-xs font-mono text-white font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {current.daily_km} km / day
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={current.daily_km}
                    onChange={(e) => onChangeCurrent({ daily_km: parseFloat(e.target.value) })}
                    className="w-full my-3"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-white/5">
                  <span>City: 15 km</span>
                  <span>Mixed: 35 km</span>
                  <span>Highway: 70+ km</span>
                </div>
              </div>

              {/* 4. PRIORITY VIBE (COMFORT VS PERFORMANCE) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ZapIcon className="w-3.5 h-3.5" />
                      <span>Priority Preference</span>
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {current.priority_pref <= 0.35
                        ? "Comfort"
                        : current.priority_pref >= 0.65
                        ? "Performance"
                        : "Balanced"}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={current.priority_pref}
                    onChange={(e) => onChangeCurrent({ priority_pref: parseFloat(e.target.value) })}
                    className="w-full my-3"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-white/5">
                  <span>🌿 Quiet & Soft Ride</span>
                  <span>⚡ Sport Dynamics</span>
                </div>
              </div>
            </div>

            {/* Preferred Body Type Quick Chips */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#090d16] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Preferred Body Style:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["all", "Sedan", "SUV", "Hatchback"].map((type) => (
                    <button
                      key={type}
                      onClick={() => onChangeCurrent({ preferred_body_type: type })}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                        current.preferred_body_type.toLowerCase() === type.toLowerCase()
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white/[0.04] text-slate-400 hover:text-white"
                      }`}
                    >
                      {type === "all" ? "All Styles" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prominent Action Button */}
              <button
                onClick={onSimulate}
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 flex items-center justify-center gap-2.5 transition transform hover:scale-105 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Recalculating Matches...</span>
                  </>
                ) : (
                  <>
                    <ZapIcon className="w-4 h-4 text-amber-300" />
                    <span>Run AI Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= DATA SCIENCE / ADVANCED MODE ================= */}
        {activeMode === "advanced" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CURRENT REALITY CONTROLS */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <SlidersIcon className="w-4 h-4" />
                  <span>Current Reality Parameters</span>
                </h3>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Budget ({formatCurrency(current.budget, currency)})
                  </label>
                  <input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step={budgetStep}
                    value={current.budget}
                    onChange={(e) => onChangeCurrent({ budget: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Passengers ({current.family_size})</label>
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={current.family_size}
                      onChange={(e) => onChangeCurrent({ family_size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Daily ({current.daily_km} km)</label>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={5}
                      value={current.daily_km}
                      onChange={(e) => onChangeCurrent({ daily_km: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Sri Lankan Leasing APR ({Math.round(current.loan_interest_apr * 100)}%)
                  </label>
                  <input
                    type="range"
                    min={0.08}
                    max={0.20}
                    step={0.005}
                    value={current.loan_interest_apr}
                    onChange={(e) => onChangeCurrent({ loan_interest_apr: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-[10px] text-slate-400">Standard SL lease rate: 12.0% - 13.5%</span>
                </div>
              </div>

              {/* DUAL-HORIZON FUTURE PLANNING */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span>Dual-Horizon Projected Future</span>
                </h3>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Planning Horizon: {future.planning_years} Years Ahead
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={5}
                    value={future.planning_years}
                    onChange={(e) => onChangeFuture({ planning_years: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Future Family ({future.family_size})</label>
                    <input
                      type="range"
                      min={2}
                      max={7}
                      value={future.family_size}
                      onChange={(e) => onChangeFuture({ family_size: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Future Daily ({future.daily_km} km)</label>
                    <input
                      type="range"
                      min={20}
                      max={150}
                      step={5}
                      value={future.daily_km}
                      onChange={(e) => onChangeFuture({ daily_km: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Expected Future Body Preference</label>
                  <select
                    value={future.preferred_body_type}
                    onChange={(e) => onChangeFuture({ preferred_body_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                  >
                    <option value="SUV">SUV (Spacious & Ground Clearance)</option>
                    <option value="Sedan">Sedan (Executive & Highway)</option>
                    <option value="all">Any Style</option>
                  </select>
                </div>
              </div>

              {/* AHP LINEAR FEATURE WEIGHTS (MCDM) */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>AHP Linear Feature Weights</span>
                  </h3>
                  <button
                    onClick={onResetWeights}
                    className="text-[10px] text-slate-400 hover:text-white font-mono underline cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget Weight:</span>
                    <span className="font-mono text-white font-bold">{Math.round(customWeights.budget * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.5}
                    step={0.05}
                    value={customWeights.budget}
                    onChange={(e) => onChangeWeights({ budget: parseFloat(e.target.value) })}
                    className="w-full"
                  />

                  <div className="flex justify-between">
                    <span className="text-slate-400">Comfort & Luxury:</span>
                    <span className="font-mono text-white font-bold">{Math.round(customWeights.comfort * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.5}
                    step={0.05}
                    value={customWeights.comfort}
                    onChange={(e) => onChangeWeights({ comfort: parseFloat(e.target.value) })}
                    className="w-full"
                  />

                  <div className="flex justify-between">
                    <span className="text-slate-400">Performance Dynamics:</span>
                    <span className="font-mono text-white font-bold">{Math.round(customWeights.performance * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.4}
                    step={0.05}
                    value={customWeights.performance}
                    onChange={(e) => onChangeWeights({ performance: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={onSimulate}
                disabled={loading}
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 transition transform hover:scale-105 cursor-pointer"
              >
                {loading ? "Re-simulating Dual Horizons..." : "Apply Data Science Weights & Simulate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
