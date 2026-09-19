"use client";

import React, { useState } from "react";
import { CarIcon, SparklesIcon, RefreshCwIcon, DollarSignIcon } from "./Icons";
import { CurrencySwitcher, CurrencyCode } from "./CurrencySwitcher";
import { soundFX } from "./AudioEffects";

interface NavbarProps {
  onOpenChat: () => void;
  onSyncCatalogue: () => void;
  onPrintReport: () => void;
  onOpenAddVehicle: () => void;
  syncing: boolean;
  modelCount: number;
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (c: CurrencyCode) => void;
  savedScenarioCount: number;
  onOpenSavedScenarios: () => void;
  onOpenGame?: () => void;
}

export function Navbar({
  onOpenChat,
  onSyncCatalogue,
  onPrintReport,
  onOpenAddVehicle,
  syncing,
  modelCount,
  selectedCurrency,
  onSelectCurrency,
  savedScenarioCount,
  onOpenSavedScenarios,
  onOpenGame,
}: NavbarProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playChime();
  };
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#080b11]/80 border-b border-white/[0.08] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
            <CarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400 font-mono">
                LUXCAR
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold uppercase tracking-wider">
                360
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI Vehicle Match & 5-Year Cost Simulator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* + Add Car Button */}
          <button
            type="button"
            onClick={onOpenAddVehicle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 border border-white/20 transition cursor-pointer"
            title="Add a new vehicle to database"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Add Car</span>
          </button>

          {/* 🎮 Highway Game Button */}
          {onOpenGame && (
            <button
              type="button"
              onClick={() => {
                soundFX.playChime();
                onOpenGame();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 border border-white/20 transition cursor-pointer hover:scale-105 active:scale-95 animate-pulse-glow"
              title="Play Highway Rush Sri Lanka Arcade Game"
            >
              <span>🎮</span>
              <span className="hidden sm:inline">Play Game</span>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="px-2 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
            title={soundEnabled ? "Automotive Sound Effects: ON" : "Sound Effects: Muted"}
          >
            <span>{soundEnabled ? "🔊" : "🔈"}</span>
            <span className="text-[10px] hidden xl:inline font-mono">{soundEnabled ? "FX ON" : "MUTE"}</span>
          </button>

          {/* Currency Switcher */}
          <CurrencySwitcher
            selectedCurrency={selectedCurrency}
            onSelectCurrency={onSelectCurrency}
          />

          {/* Database Live Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{modelCount} Models Live</span>
          </div>

          {/* Saved Scenarios Button */}
          <button
            onClick={onOpenSavedScenarios}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 transition hover:text-white cursor-pointer"
            title="Saved Scenarios"
          >
            <span>💾 Saved</span>
            {savedScenarioCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                {savedScenarioCount}
              </span>
            )}
          </button>

          {/* Export PDF Report Button */}
          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 hover:text-white transition cursor-pointer"
            title="Print / Save PDF Report"
          >
            <span>📄</span>
            <span className="hidden md:inline">Export PDF</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onSyncCatalogue}
            disabled={syncing}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 transition hover:text-white disabled:opacity-50 cursor-pointer"
            title="Sync external automotive catalogue"
          >
            <RefreshCwIcon className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-blue-400" : ""}`} />
            <span className="hidden md:inline">{syncing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* AI Concierge Drawer Trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 border border-white/20 transition cursor-pointer shrink-0"
          >
            <SparklesIcon className="w-4 h-4 text-blue-200" />
            <span>LuxAI</span>
          </button>
        </div>
      </div>

      {/* Sri Lankan Market Note Banner when LKR is active */}
      {selectedCurrency === "LKR" && (
        <div className="bg-blue-500/10 border-t border-blue-500/20 px-4 py-1.5 text-center text-[11px] text-cyan-300 flex items-center justify-center gap-2">
          <span>🇱🇰 <strong>Sri Lankan Market Mode Active:</strong> Calibrated with real Sri Lankan market valuations (Millions & Lakhs), fuel at Rs. 368/L, and Central Bank leasing rates.</span>
        </div>
      )}
    </header>
  );
}
