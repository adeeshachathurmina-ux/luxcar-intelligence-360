"use client";

import React from "react";
import { SparklesIcon, ShieldCheckIcon, TrendingUpIcon, RefreshCwIcon } from "./Icons";

interface DecisionSupport {
  verdict: string;
  compatibility_level: string;
  reasons: string[];
  recommended_timing: string;
}

interface DecisionCardProps {
  decision: DecisionSupport;
  aiAdvice: string;
  loadingAdvice: boolean;
  onRefreshAdvice: () => void;
  onOpenChat: () => void;
}

export function DecisionCard({
  decision,
  aiAdvice,
  loadingAdvice,
  onRefreshAdvice,
  onOpenChat,
}: DecisionCardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 1/3: Strategic "Wait or Buy Now?" Matrix */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between border-t-2 border-t-blue-500">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Decision Support Engine
              </span>
            </div>

            <h3 className="text-2xl font-black text-white leading-tight mb-2">
              {decision.verdict}
            </h3>

            <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 mb-6">
              Compatibility: {decision.compatibility_level}
            </div>

            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Decision Rationale:
              </span>
              {decision.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <span className="text-[11px] text-slate-400 block font-medium">Recommended Horizon:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {decision.recommended_timing}
            </span>
          </div>
        </div>

        {/* RIGHT 2/3: AI Executive Ownership Advisory (GenAI) */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl glow-sapphire flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <SparklesIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    LuxAI Executive Ownership Advisory
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Synthesized from vehicle telemetry, depreciation models, and your personal scenario.
                  </span>
                </div>
              </div>

              <button
                onClick={onRefreshAdvice}
                disabled={loadingAdvice}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition cursor-pointer disabled:opacity-50"
                title="Regenerate Executive Report"
              >
                <RefreshCwIcon className={`w-4 h-4 ${loadingAdvice ? "animate-spin text-blue-400" : ""}`} />
              </button>
            </div>

            {loadingAdvice ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Generating strategic executive advisory...</p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {aiAdvice}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Need specific clarification on reliability, financing, or baby car seats?
            </span>
            <button
              onClick={onOpenChat}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Discuss with LuxAI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
