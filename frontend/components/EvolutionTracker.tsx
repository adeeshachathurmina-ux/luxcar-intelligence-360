"use client";

import React, { useState, useEffect } from "react";
import { TrendingUpIcon, GaugeIcon, RefreshCwIcon } from "./Icons";
import { resolveVehicleImage } from "./VehicleImageResolver";

interface EvolutionVehicle {
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
  seating_capacity: number;
  boot_space_liters: number;
  base_price_usd: number;
  annual_maintenance_usd: number;
  reliability_score: number;
  comfort_score: number;
  performance_score: number;
  image_url: string;
}

export function EvolutionTracker() {
  const [selectedModel, setSelectedModel] = useState<string>("BMW:3 Series");
  const [generations, setGenerations] = useState<EvolutionVehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const modelOptions = [
    { label: "BMW 3 Series (F30 → G20 → 2025 LCI II)", value: "BMW:3 Series" },
    { label: "Mercedes-Benz C-Class (W205 → W206 → Hybrid)", value: "Mercedes-Benz:C-Class" },
    { label: "Audi A4 (B9 → B9.5 → 2025)", value: "Audi:A4" },
    { label: "BMW X3 (G01 → 2025 G45)", value: "BMW:X3" },
    { label: "Mercedes-Benz GLC (X253 → X254)", value: "Mercedes-Benz:GLC" },
    { label: "Porsche Macan (95B.2 → 95B.3 GTS)", value: "Porsche:Macan" },
  ];

  useEffect(() => {
    const fetchEvolution = async () => {
      setLoading(true);
      const [brand, model] = selectedModel.split(":");
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/vehicles/evolution/${encodeURIComponent(brand)}/${encodeURIComponent(model)}`);
        if (res.ok) {
          const data = await res.json();
          setGenerations(data);
        }
      } catch (err) {
        console.error("Failed to fetch evolution:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvolution();
  }, [selectedModel]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Vehicle Evolution Tracker
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Cross-Generation Technological Progress
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track how powertrain efficiency, chassis dynamics, and cabin architecture evolved across generational cycles.
            </p>
          </div>

          {/* Model Dropdown */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {modelOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading generation telemetry...</p>
          </div>
        ) : generations.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">No generation records found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((g, idx) => {
              const isLatest = idx === generations.length - 1;
              return (
                <div
                  key={g.id}
                  className={`glass-card p-5 rounded-2xl flex flex-col justify-between relative ${
                    isLatest ? "border border-indigo-500/40 glow-sapphire" : ""
                  }`}
                >
                  {isLatest && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Latest Gen
                    </span>
                  )}

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {g.generation} Series
                    </span>
                    <h4 className="text-lg font-black text-white">
                      {g.brand} {g.model} ({g.year})
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">{g.trim}</p>

                    {/* Image */}
                    <div className="h-36 w-full rounded-xl overflow-hidden mb-4 bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveVehicleImage(g)}
                        alt={`${g.brand} ${g.model}`}
                        className="w-full h-full object-cover object-center opacity-90 transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Spec List */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-slate-400">Engine / Fuel:</span>
                        <span className="font-semibold text-white">{g.fuel_type}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-slate-400">Horsepower:</span>
                        <span className="font-mono font-bold text-blue-400">{g.horsepower} HP</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-slate-400">Torque:</span>
                        <span className="font-mono font-bold text-white">{g.torque_nm} Nm</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-slate-400">Consumption:</span>
                        <span className="font-mono text-emerald-400">{g.fuel_consumption_l100km} L/100km</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/[0.04]">
                        <span className="text-slate-400">Cargo Volume:</span>
                        <span className="font-mono text-white">{g.boot_space_liters} Liters</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Launch Valuation:</span>
                    <span className="text-sm font-black font-mono text-white">
                      ${g.base_price_usd.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
