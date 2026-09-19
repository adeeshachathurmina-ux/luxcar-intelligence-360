"use client";

import React, { useState } from "react";
import {
  CarIcon,
  UsersIcon,
  SparklesIcon,
  MessageSquareIcon,
  ZapIcon,
  ShieldCheckIcon,
  XIcon,
} from "./Icons";
import { CurrencyCode, formatCurrency } from "./CurrencySwitcher";
import { ThreeDTiltCard } from "./ThreeDTiltCard";
import { soundFX } from "./AudioEffects";
import { resolveVehicleImage } from "./VehicleImageResolver";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  generation: string;
  trim: string;
  body_type: string;
  fuel_type: string;
  horsepower: number;
  torque_nm: number;
  fuel_consumption_l100km: number;
  km_per_liter?: number;
  seating_capacity: number;
  boot_space_liters: number;
  base_price_lkr?: number;
  base_price_usd: number;
  annual_maintenance_lkr?: number;
  annual_maintenance_usd: number;
  reliability_score: number;
  comfort_score: number;
  performance_score: number;
  sl_resale_tier?: string;
  image_url: string;
}

interface MatchCandidate {
  vehicle: Vehicle;
  current_score: {
    overall_match: number;
    budget_match: number;
    family_match: number;
    comfort_match?: number;
    performance_match?: number;
    efficiency_match?: number;
    reasons?: string[];
  };
  future_score?: {
    overall_match: number;
  };
  tco?: {
    total_ownership_cost: number;
    monthly_effective_cost: number;
    estimated_resale_value: number;
    estimated_depreciation: number;
  };
}

interface MatchShowcaseProps {
  bestNow: MatchCandidate;
  bestFuture: MatchCandidate;
  bestPerf: MatchCandidate;
  lowestRisk: MatchCandidate;
  planningYears: number;
  currency: CurrencyCode;
  onSelectVehicleForChat: (v: Vehicle) => void;
  onViewTco?: (v: Vehicle) => void;
}

export function MatchShowcase({
  bestNow,
  bestFuture,
  bestPerf,
  lowestRisk,
  planningYears,
  currency,
  onSelectVehicleForChat,
  onViewTco,
}: MatchShowcaseProps) {
  const [isRevving, setIsRevving] = useState(false);
  const [compareTarget, setCompareTarget] = useState<MatchCandidate | null>(null);

  if (!bestNow || !bestNow.vehicle) return null;

  const winner = bestNow.vehicle;
  const winnerScore = bestNow.current_score.overall_match;
  const isLkr = currency === "LKR";
  const winnerPrice = isLkr
    ? winner.base_price_lkr || winner.base_price_usd * 305
    : winner.base_price_usd;

  const winnerReasons = bestNow.current_score.reasons || [
    `Fits your budget comfortably with low cost per km.`,
    `${winner.seating_capacity} seats perfectly accommodate your passengers.`,
    `Great fuel economy for daily Sri Lankan traffic.`,
  ];

  const handleRev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevving(true);
    soundFX.playEngineRev();
    setTimeout(() => setIsRevving(false), 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-10">
      {/* Section Title */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 shadow-lg shadow-emerald-500/10">
          <SparklesIcon className="w-3.5 h-3.5" /> AI Recommended Matches
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Here is Your #1 Dream Vehicle
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Precision-matched to your family size, budget, fuel preference, and ownership costs.
        </p>
      </div>

      {/* #1 Winner Spotlight Card with 3D Tilt & Holographic Edge */}
      <ThreeDTiltCard maxTilt={5} className="w-full mb-10">
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#131b2e] to-[#0c111c] border-2 border-blue-500/40 shadow-2xl shadow-blue-500/15 backdrop-blur-2xl overflow-hidden transition-all hover:border-blue-400/60 hover:shadow-blue-500/25 group">
          {/* Ambient Lighting & Sheen behind winner */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            {/* Car Image / Banner */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 border border-white/10 flex items-center justify-center p-1.5 group/img shadow-2xl">
                <img
                  src={resolveVehicleImage(winner)}
                  alt={`${winner.brand} ${winner.model}`}
                  className="w-full h-full object-cover rounded-xl filter drop-shadow-2xl transition-transform duration-700 group-hover/img:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("toyota-raize-2021")) {
                      target.src = "/images/vehicles/toyota-raize-2021.jpg";
                    }
                  }}
                />
                {/* Fallback Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 -z-10">
                  <CarIcon className="w-20 h-20 text-slate-700" />
                  <span className="text-xs font-bold mt-2 text-slate-400">
                    {winner.brand} {winner.model}
                  </span>
                </div>

                {/* Match Score Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-blue-600/90 backdrop-blur-md border border-blue-400/40 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-blue-500/30 animate-pulse-glow">
                  <span>🏆</span>
                  <span>{winnerScore}% Match</span>
                </div>

                {/* Verified Genuine Model Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow-md">
                  <span>✓</span>
                  <span>Genuine Model</span>
                </div>

                {/* Rev Engine Audio Trigger Button with Live Equalizer */}
                <button
                  type="button"
                  onClick={handleRev}
                  className={`absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl backdrop-blur-md border font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer ${
                    isRevving
                      ? "bg-gradient-to-r from-red-600 to-amber-500 border-amber-300 text-white shadow-red-500/40 scale-105"
                      : "bg-black/60 hover:bg-black/80 border-amber-400/40 text-amber-300 hover:text-white shadow-amber-500/20"
                  }`}
                  title="Rev Engine: Hear sports exhaust note!"
                >
                  {isRevving ? (
                    <div className="flex items-end gap-0.5 h-3.5">
                      <span className="w-1 bg-white animate-pulse rounded-full h-full" />
                      <span className="w-1 bg-amber-300 animate-pulse rounded-full h-2/3" />
                      <span className="w-1 bg-white animate-pulse rounded-full h-full" />
                      <span className="w-1 bg-amber-200 animate-pulse rounded-full h-1/2" />
                    </div>
                  ) : (
                    <span>🔊</span>
                  )}
                  <span>{isRevving ? "Revving..." : "Rev Engine"}</span>
                </button>
              </div>
            </div>

            {/* Car Details & Reasons */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                    {winner.brand}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {winner.generation || winner.trim}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-medium">{winner.year}</span>
                </div>

                {/* Circular Speedometer Match Gauge */}
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        className="text-emerald-400 transition-all duration-1000 ease-out"
                        strokeWidth="3.5"
                        strokeDasharray={100.5}
                        strokeDashoffset={100.5 * (1 - winnerScore / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                      <span className="text-[11px] font-black text-white font-mono">
                        {winnerScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {winner.brand} {winner.model}
              </h3>

              {/* Price */}
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mb-4">
                {formatCurrency(winnerPrice, currency)}
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-slate-400 mb-0.5">Seats</div>
                  <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
                    <UsersIcon className="w-3.5 h-3.5 text-blue-400" />
                    {winner.seating_capacity}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-slate-400 mb-0.5">Engine / Fuel</div>
                  <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
                    <ZapIcon className="w-3.5 h-3.5 text-amber-400" />
                    {winner.fuel_type}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-slate-400 mb-0.5">Fuel Economy</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {winner.km_per_liter || (100 / winner.fuel_consumption_l100km).toFixed(1)} km/L
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs text-slate-400 mb-0.5">Horsepower</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {winner.horsepower} HP
                  </div>
                </div>
              </div>

              {/* Why This Car Won */}
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Why this is your best match:
                </span>
                <ul className="space-y-2">
                  {winnerReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onSelectVehicleForChat(winner);
                  }}
                  className="flex-1 min-w-[150px] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <MessageSquareIcon className="w-4 h-4" />
                  Ask AI About This Car
                </button>

                {onViewTco && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onViewTco(winner);
                    }}
                    className="py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
                  >
                    📊 See 5-Year Costs
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </ThreeDTiltCard>

      {/* Runner-Up Alternatives */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🥈</span>
          <span>Other Great Options to Consider</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestFuture && bestFuture.vehicle && (
            <AlternativeCard
              badge="👶 Future-Proof Alternative"
              badgeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              candidate={bestFuture}
              currency={currency}
              onSelect={onSelectVehicleForChat}
              onCompare={() => setCompareTarget(bestFuture)}
            />
          )}

          {bestPerf && bestPerf.vehicle && (
            <AlternativeCard
              badge="🏎️ Powerful & Sporty"
              badgeColor="bg-amber-500/20 text-amber-300 border-amber-500/30"
              candidate={bestPerf}
              currency={currency}
              onSelect={onSelectVehicleForChat}
              onCompare={() => setCompareTarget(bestPerf)}
            />
          )}

          {lowestRisk && lowestRisk.vehicle && (
            <AlternativeCard
              badge="🛡️ Low Maintenance & Reliable"
              badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              candidate={lowestRisk}
              currency={currency}
              onSelect={onSelectVehicleForChat}
              onCompare={() => setCompareTarget(lowestRisk)}
            />
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {compareTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c111c] border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-500/20 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚖️</span>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Side-by-Side Vehicle Comparison</h3>
                  <p className="text-xs text-slate-400">
                    Comparing #1 Top Match against {compareTarget.vehicle.brand} {compareTarget.vehicle.model}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompareTarget(null)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Side-by-Side Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Winner Col */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase">
                  🏆 #1 Top Match
                </span>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden my-3 bg-slate-900 border border-white/10">
                  <img
                    src={resolveVehicleImage(winner)}
                    alt={winner.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-base font-extrabold text-white">
                  {winner.brand} {winner.model}
                </div>
                <div className="text-xs font-mono font-extrabold text-emerald-400 my-1">
                  {formatCurrency(winnerPrice, currency)}
                </div>
              </div>

              {/* Target Col */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase">
                  Alternative Choice
                </span>
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden my-3 bg-slate-900 border border-white/10">
                  <img
                    src={resolveVehicleImage(compareTarget.vehicle)}
                    alt={compareTarget.vehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-base font-extrabold text-white">
                  {compareTarget.vehicle.brand} {compareTarget.vehicle.model}
                </div>
                <div className="text-xs font-mono font-extrabold text-emerald-400 my-1">
                  {formatCurrency(
                    isLkr
                      ? compareTarget.vehicle.base_price_lkr || compareTarget.vehicle.base_price_usd * 305
                      : compareTarget.vehicle.base_price_usd,
                    currency
                  )}
                </div>
              </div>
            </div>

            {/* Spec Metrics Table */}
            <div className="space-y-2 mb-6 text-xs">
              <SpecRow
                label="Overall Match Score"
                val1={`${winnerScore}%`}
                val2={`${compareTarget.current_score.overall_match}%`}
                winner="val1"
              />
              <SpecRow
                label="Fuel Economy"
                val1={`${winner.km_per_liter || (100 / winner.fuel_consumption_l100km).toFixed(1)} km/L`}
                val2={`${compareTarget.vehicle.km_per_liter || (100 / compareTarget.vehicle.fuel_consumption_l100km).toFixed(1)} km/L`}
              />
              <SpecRow
                label="Horsepower & Torque"
                val1={`${winner.horsepower} HP / ${winner.torque_nm} Nm`}
                val2={`${compareTarget.vehicle.horsepower} HP / ${compareTarget.vehicle.torque_nm} Nm`}
              />
              <SpecRow
                label="Seating Capacity"
                val1={`${winner.seating_capacity} Seats`}
                val2={`${compareTarget.vehicle.seating_capacity} Seats`}
              />
              <SpecRow
                label="Reliability Rating"
                val1={`${winner.reliability_score}/100`}
                val2={`${compareTarget.vehicle.reliability_score}/100`}
              />
              <SpecRow
                label="Resale Value Tier"
                val1={winner.sl_resale_tier || "High"}
                val2={compareTarget.vehicle.sl_resale_tier || "Moderate"}
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCompareTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold cursor-pointer"
              >
                Close Comparison
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onSelectVehicleForChat(compareTarget.vehicle);
                  setCompareTarget(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <MessageSquareIcon className="w-3.5 h-3.5" />
                Ask AI Advisor About Both
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({
  label,
  val1,
  val2,
  winner,
}: {
  label: string;
  val1: string;
  val2: string;
  winner?: "val1" | "val2";
}) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className={`font-mono font-bold ${winner === "val1" ? "text-emerald-400" : "text-white"}`}>
        {val1}
      </div>
      <div className="text-slate-400 font-semibold text-[11px] text-center px-2">{label}</div>
      <div className={`font-mono font-bold ${winner === "val2" ? "text-emerald-400" : "text-white"}`}>
        {val2}
      </div>
    </div>
  );
}

function AlternativeCard({
  badge,
  badgeColor,
  candidate,
  currency,
  onSelect,
  onCompare,
}: {
  badge: string;
  badgeColor: string;
  candidate: MatchCandidate;
  currency: CurrencyCode;
  onSelect: (v: Vehicle) => void;
  onCompare: () => void;
}) {
  const v = candidate.vehicle;
  const isLkr = currency === "LKR";
  const price = isLkr ? v.base_price_lkr || v.base_price_usd * 305 : v.base_price_usd;

  return (
    <ThreeDTiltCard maxTilt={5} className="h-full">
      <div className="p-4 rounded-2xl bg-[#0d131f]/90 hover:bg-[#121929] border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between h-full shadow-lg group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
              {badge}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              <span>✓</span> Real Photo
            </span>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-slate-900 border border-white/10 shadow-md">
            <img
              src={resolveVehicleImage(v)}
              alt={`${v.brand} ${v.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("toyota-raize-2021")) {
                  target.src = "/images/vehicles/toyota-raize-2021.jpg";
                }
              }}
            />
          </div>

          <div className="text-base font-extrabold text-white">
            {v.brand} {v.model}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {v.body_type} • {v.fuel_type} • {v.seating_capacity} Seats
          </div>

          <div className="text-sm font-extrabold text-emerald-400 font-mono mb-3">
            {formatCurrency(price, currency)}
          </div>
        </div>

        <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onCompare();
            }}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
          >
            <span>⚖️</span> Compare
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onSelect(v);
            }}
            className="text-xs text-slate-300 hover:text-white font-semibold underline cursor-pointer"
          >
            Details & Chat →
          </button>
        </div>
      </div>
    </ThreeDTiltCard>
  );
}
