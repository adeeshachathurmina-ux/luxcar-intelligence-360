"use client";

import React from "react";
import { GaugeIcon, ShieldCheckIcon, UsersIcon, DollarSignIcon, SparklesIcon } from "./Icons";

interface ScoreProps {
  nowCarName: string;
  nowScores: {
    overall_match: number;
    budget_match: number;
    family_match: number;
    comfort_match: number;
    performance_match: number;
    efficiency_match: number;
  };
  futureCarName: string;
  futureScores: {
    overall_match: number;
    budget_match: number;
    family_match: number;
    comfort_match: number;
    performance_match: number;
    efficiency_match: number;
  };
}

export function ScoreBreakdownRadar({
  nowCarName,
  nowScores,
  futureCarName,
  futureScores,
}: ScoreProps) {
  const metrics = [
    {
      label: "Budget Compatibility",
      desc: "Purchase cost vs allocated capital ceiling",
      now: nowScores.budget_match,
      fut: futureScores.budget_match,
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Family & Cargo Practicality",
      desc: "Seating capacity, ISOFIX ease, and boot volume",
      now: nowScores.family_match,
      fut: futureScores.family_match,
      color: "from-indigo-500 to-blue-400",
    },
    {
      label: "Cabin Comfort & Refinement",
      desc: "Ride smoothness, acoustic insulation, suspension setup",
      now: nowScores.comfort_match,
      fut: futureScores.comfort_match,
      color: "from-purple-500 to-indigo-400",
    },
    {
      label: "Powertrain & Track Performance",
      desc: "Horsepower, torque delivery, chassis agility",
      now: nowScores.performance_match,
      fut: futureScores.performance_match,
      color: "from-amber-500 to-orange-400",
    },
    {
      label: "Commute Fuel Efficiency",
      desc: "Daily fuel/kWh burn across commute distance",
      now: nowScores.efficiency_match,
      fut: futureScores.efficiency_match,
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Transparent Algorithm Breakdown
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Explainable Factor Compatibility
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-300">{nowCarName} (Current)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-slate-300">{futureCarName} (Future)</span>
            </div>
          </div>
        </div>

        {/* Progress Bars Grid */}
        <div className="space-y-6">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{m.label}</h4>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono font-bold">
                  <span className="text-blue-400">Now: {m.now}%</span>
                  <span className="text-amber-400">Future: {m.fut}%</span>
                </div>
              </div>

              {/* Dual Progress Bars */}
              <div className="space-y-2">
                {/* Now Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, m.now)}%` }}
                  />
                </div>
                {/* Future Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(100, m.fut)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scientific Note */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            * Scores are calculated through Multi-Attribute Utility Analysis normalized against real-world test specifications.
          </span>
          <span className="text-blue-400 font-semibold">100% Explainable Architecture</span>
        </div>
      </div>
    </div>
  );
}
