"use client";

import React, { useState } from "react";
import { SparklesIcon, ZapIcon, CarIcon } from "./Icons";
import { soundFX } from "./AudioEffects";

interface HeroSectionProps {
  onAutoFillPrompt: (promptText: string) => void;
  onApplyPreset?: (preset: any) => void;
  parsingPrompt: boolean;
}

export function HeroSection({
  onAutoFillPrompt,
  onApplyPreset,
  parsingPrompt,
}: HeroSectionProps) {
  const [inputText, setInputText] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      soundFX.playChime();
      onAutoFillPrompt(inputText);
    }
  };

  const sampleQueries = [
    { label: "🌿 15M Hybrid SUV", text: "Budget 15 Million LKR, family of 4, need a hybrid SUV with low fuel consumption" },
    { label: "⚡ 25M Electric Daily", text: "Budget 25 Million LKR, daily office run 30km, want a modern electric vehicle" },
    { label: "🚐 35M 7-Seater Family", text: "Budget 35 Million LKR, big family with 7 seats, need large boot for trips" },
    { label: "🏎️ 12M Sport Sedan", text: "Budget 12 Million LKR, 2 seats couple, fast petrol sport sedan" },
  ];

  return (
    <section className="relative pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Top Dynamic Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-blue-500/10 animate-fade-in-up">
        <span>🇱🇰 Sri Lanka Edition</span>
        <span className="text-slate-600">•</span>
        <span className="text-cyan-300">Live AI Vehicle Match</span>
      </div>

      {/* Main Punchy Heading with Gradient Shimmer */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-3">
        Find Your Perfect Car in{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">
          Seconds
        </span>
      </h1>

      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6">
        Smart vehicle matching & 5-year running cost simulation calibrated for Sri Lanka.
      </p>

      {/* Clean AI Search Bar */}
      <div className="max-w-2xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-[#0d131f]/90 border border-white/15 shadow-2xl shadow-blue-500/15 backdrop-blur-xl transition-all hover:border-blue-500/40">
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'Budget 15M, family of 4, need a hybrid SUV with large boot...'"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={parsingPrompt || !inputText.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer shrink-0 shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
          >
            {parsingPrompt ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Matching...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 text-amber-300" />
                <span>Search with AI</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Clickable Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 max-w-2xl mx-auto">
        <span className="text-[11px] text-slate-500 font-medium">Try clicking:</span>
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              soundFX.playClick();
              setInputText(q.text);
              onAutoFillPrompt(q.text);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-400/40 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Automotive Telemetry Stats Bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mt-5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>40+ Sri Lanka Models</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">🎯</span>
          <span>100% Transparent Math</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400 font-bold">⚡</span>
          <span>Instant Cost Simulation</span>
        </div>
      </div>
    </section>
  );
}
