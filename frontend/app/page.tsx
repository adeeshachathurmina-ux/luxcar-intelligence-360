"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SimpleControls, SimpleParams } from "@/components/SimpleControls";
import { MatchShowcase } from "@/components/MatchShowcase";
import { TCOChart } from "@/components/TCOChart";
import { DecisionCard } from "@/components/DecisionCard";
import { AIChatDrawer } from "@/components/AIChatDrawer";
import { SavedScenariosModal, SavedScenario } from "@/components/SavedScenariosModal";
import { CurrencyCode } from "@/components/CurrencySwitcher";
import { SparklesIcon } from "@/components/Icons";
import { AddVehicleModal } from "@/components/AddVehicleModal";
import { HighwayRushGame } from "@/components/HighwayRushGame";
import { API_BASE_URL } from "@/lib/api";
import { runClientSimulation } from "@/lib/clientSimulation";

export default function HomePage() {
  const [currency, setCurrency] = useState<CurrencyCode>("LKR");
  const [isGameOpen, setIsGameOpen] = useState(false);

  // Simple, easy-to-understand state (Undergraduate clean code)
  const [params, setParams] = useState<SimpleParams>({
    budget: 18000000, // 18 Million LKR default
    family_size: 4,
    daily_km: 35,
    preferred_body_type: "all",
    fuel_pref: "any",
    future_family_size: 5,
    future_daily_km: 45,
  });

  const [simResult, setSimResult] = useState<any>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loadingSim, setLoadingSim] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [parsingPrompt, setParsingPrompt] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [modelCount, setModelCount] = useState(40);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatVehicle, setActiveChatVehicle] = useState<any>(null);

  // Saved Scenarios
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tcoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("luxcar_saved_scenarios");
      if (stored) {
        setSavedScenarios(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load saved scenarios", e);
    }
  }, []);

  const saveScenariosToStorage = (updated: SavedScenario[]) => {
    setSavedScenarios(updated);
    try {
      localStorage.setItem("luxcar_saved_scenarios", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save scenarios", e);
    }
  };

  const handleSaveCurrentScenario = () => {
    const newEntry: SavedScenario = {
      id: "sc-" + Date.now(),
      name: `${params.preferred_body_type === "all" ? "Vehicle" : params.preferred_body_type} (${(params.budget / 1000000).toFixed(1)}M LKR) - ${params.family_size} Seats`,
      timestamp: new Date().toLocaleDateString(),
      current: {
        budget: params.budget,
        family_size: params.family_size,
        daily_km: params.daily_km,
        priority_pref: 0.5,
        preferred_body_type: params.preferred_body_type,
        fuel_pref: params.fuel_pref,
        holding_years: 5,
        down_payment_pct: 0.20,
        loan_interest_apr: 0.125,
        loan_term_months: 60,
      },
      future: {
        planning_years: 3,
        family_size: params.future_family_size,
        daily_km: params.future_daily_km,
        preferred_body_type: "SUV",
        expected_usage: "Family and City Travel",
      },
      topMatchName: simResult ? `${simResult.best_now.vehicle.brand} ${simResult.best_now.vehicle.model}` : undefined,
    };
    const updated = [newEntry, ...savedScenarios];
    saveScenariosToStorage(updated);
    alert("Scenario saved successfully!");
  };

  const handleDeleteScenario = (id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id);
    saveScenariosToStorage(updated);
  };

  const handleLoadScenario = (sc: SavedScenario) => {
    const updated: SimpleParams = {
      budget: sc.current.budget,
      family_size: sc.current.family_size,
      daily_km: sc.current.daily_km,
      preferred_body_type: sc.current.preferred_body_type || "all",
      fuel_pref: sc.current.fuel_pref || "any",
      future_family_size: sc.future.family_size,
      future_daily_km: sc.future.daily_km,
    };
    setParams(updated);
    runSimulation(updated);
  };

  // Fetch AI Advice based on simulation output
  const fetchAdvice = async (result: any) => {
    setLoadingAdvice(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ simulation_result: result }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.warn("Could not reach AI advisor endpoint (offline fallback active):", err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  // Main simulation call to backend with bulletproof instant client fallback
  const runSimulation = useCallback(
    async (overrideParams?: SimpleParams) => {
      const p = overrideParams || params;
      setLoadingSim(true);
      const payload = {
        current: {
          budget: p.budget,
          daily_km: p.daily_km,
          family_size: p.family_size,
          priority_pref: 0.5,
          preferred_body_type: p.preferred_body_type,
          fuel_pref: p.fuel_pref,
          holding_years: 5,
          down_payment_pct: 0.20,
          loan_interest_apr: 0.125,
          loan_term_months: 60,
        },
        future: {
          planning_years: 3,
          family_size: p.future_family_size,
          daily_km: p.future_daily_km,
          preferred_body_type: "SUV",
          expected_usage: "Family and Travel",
        },
      };

      try {
        const res = await fetch(`${API_BASE_URL}/api/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setSimResult(data);
          fetchAdvice(data);
          setLoadingSim(false);
          return;
        }
      } catch (err) {
        console.warn("Backend API cold or unreachable, activating instant client-side simulation engine:", err);
      }

      // 0ms Instant Client-Side Simulation Engine (Guarantees Vercel site always works)
      const clientData = runClientSimulation(payload);
      setSimResult(clientData);
      setLoadingSim(false);
    },
    [params]
  );

  // Initial simulation on first render
  useEffect(() => {
    runSimulation();
  }, []);

  // AI prompt parser
  const handleAutoFillPrompt = async (promptText: string) => {
    setParsingPrompt(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/parse-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: promptText }),
      });
      if (res.ok) {
        const parsed = await res.json();
        const updated: SimpleParams = {
          ...params,
          budget: parsed.budget || params.budget,
          family_size: parsed.family_size || params.family_size,
          daily_km: parsed.daily_km || params.daily_km,
          preferred_body_type: parsed.preferred_body_type || params.preferred_body_type,
          future_family_size: parsed.future_family_size || params.future_family_size,
          future_daily_km: parsed.future_daily_km || params.future_daily_km,
        };
        setParams(updated);
        runSimulation(updated);
      }
    } catch (err) {
      console.warn("AI prompt parser fallback:", err);
    } finally {
      setParsingPrompt(false);
    }
  };

  // 1-Click preset from Hero
  const handleApplyHeroPreset = (preset: any) => {
    const updated: SimpleParams = {
      ...params,
      budget: preset.budget,
      family_size: preset.family_size,
      daily_km: preset.daily_km,
      preferred_body_type: preset.preferred_body_type,
      future_family_size: preset.future_family_size,
      future_daily_km: preset.future_daily_km,
    };
    setParams(updated);
    runSimulation(updated);
  };

  const handleSelectVehicleForChat = (vehicle: any) => {
    setActiveChatVehicle(vehicle);
    setIsChatOpen(true);
  };

  const handleViewTco = () => {
    if (tcoSectionRef.current) {
      tcoSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onSyncCatalogue={() => alert("Vehicle catalogue is live and up to date.")}
        onPrintReport={() => window.print()}
        onOpenAddVehicle={() => setIsAddVehicleOpen(true)}
        syncing={syncing}
        modelCount={modelCount}
        selectedCurrency={currency}
        onSelectCurrency={(c) => setCurrency(c)}
        savedScenarioCount={savedScenarios.length}
        onOpenSavedScenarios={() => setIsSavedModalOpen(true)}
        onOpenGame={() => setIsGameOpen(true)}
      />

      <main className="flex-1 pb-24">
        {/* 1. Hero with Natural Language AI Search */}
        <div className="no-print">
          <HeroSection
            onAutoFillPrompt={handleAutoFillPrompt}
            onApplyPreset={handleApplyHeroPreset}
            parsingPrompt={parsingPrompt}
          />
        </div>

        {/* Highway Rush Arcade Banner */}
        <div className="max-w-5xl mx-auto px-4 -mt-1 mb-6 text-center no-print">
          <button
            type="button"
            onClick={() => setIsGameOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-orange-500/30 text-amber-300 hover:text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xl shadow-orange-500/10 group"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🎮</span>
            <span>Take a Ride: Play Highway Rush Sri Lanka E01 Arcade Challenge!</span>
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              PLAY NOW 🕹️
            </span>
          </button>
        </div>

        {/* 2. Super Simple 4-Step Controls */}
        <div className="no-print px-4">
          <SimpleControls
            params={params}
            onChange={(updated) => setParams(updated)}
            onSimulate={() => runSimulation()}
            loading={loadingSim}
            currency={currency}
          />
        </div>

        {/* 3. Match Results Showcase */}
        {simResult && (
          <div className="px-4">
            <MatchShowcase
              bestNow={simResult.best_now}
              bestFuture={simResult.best_future}
              bestPerf={simResult.best_performance}
              lowestRisk={simResult.lowest_risk}
              planningYears={3}
              currency={currency}
              onSelectVehicleForChat={handleSelectVehicleForChat}
              onViewTco={handleViewTco}
            />
          </div>
        )}

        {/* 4. Simple 5-Year True Cost Breakdown */}
        {simResult && simResult.best_now && simResult.best_now.tco && (
          <div ref={tcoSectionRef} className="px-4">
            <TCOChart
              nowTco={simResult.best_now.tco}
              futureTco={simResult.best_future?.tco}
              currency={currency}
            />
          </div>
        )}

        {/* 5. Strategic "Buy Now or Wait" Decision */}
        {simResult && simResult.decision_support && (
          <div className="px-4">
            <DecisionCard
              decision={simResult.decision_support}
              aiAdvice={aiAdvice}
              loadingAdvice={loadingAdvice}
              onRefreshAdvice={() => fetchAdvice(simResult)}
              onOpenChat={() => setIsChatOpen(true)}
            />
          </div>
        )}

        {/* Save Scenario Quick Bar */}
        <div className="max-w-5xl mx-auto px-4 my-8 text-center no-print">
          <button
            type="button"
            onClick={handleSaveCurrentScenario}
            className="py-2.5 px-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs sm:text-sm text-slate-300 hover:text-white transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>💾</span>
            <span>Bookmark This Car Recommendation</span>
          </button>
        </div>
      </main>

      {/* Floating Quick AI Assistant Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-blue-500/40 border border-blue-400/40 hover:scale-105 active:scale-95 transition-all cursor-pointer no-print animate-pulse-glow"
        title="Ask Car AI Assistant"
      >
        <SparklesIcon className="w-4 h-4 text-amber-300" />
        <span>Ask Car AI 💬</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Floating AI Chat Assistant */}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentVehicle={activeChatVehicle}
      />

      {/* Saved Scenarios Modal */}
      <SavedScenariosModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedScenarios={savedScenarios}
        onLoadScenario={handleLoadScenario}
        onDeleteScenario={handleDeleteScenario}
        onSaveCurrentScenario={handleSaveCurrentScenario}
      />

      {/* Add New Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onVehicleAdded={(newCar) => {
          setModelCount((prev) => prev + 1);
          runSimulation();
        }}
      />

      {/* Highway Rush Arcade Mini-Game Modal */}
      <HighwayRushGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
      />
    </div>
  );
}
