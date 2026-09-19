"use client";

import React, { useState, useEffect } from "react";
import { SparklesIcon, BarChart3Icon, CpuIcon, LayersIcon, InfoIcon } from "./Icons";
import { formatCurrency, CurrencyCode } from "./CurrencySwitcher";

interface ClusterPoint {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  cluster_id: number;
  cluster_name: string;
  color: string;
  horsepower: number;
  km_per_liter: number;
  fuel_consumption: number;
  price_lkr: number;
  price_millions: number;
  price_lakhs: number;
  body_type: string;
  fuel_type: string;
  x_pct: number;
  y_pct: number;
  image_url: string;
}

interface Centroid {
  cluster_id: number;
  label: string;
  badge: string;
  description: string;
  color: string;
  center_horsepower: number;
  center_km_per_liter: number;
  avg_price_lkr: number;
  avg_price_millions: number;
  vehicle_count: number;
  x_pct: number;
  y_pct: number;
}

interface ClusterData {
  model_metadata: {
    algorithm: string;
    preprocessing: string;
    features_used: string[];
    total_vehicles: number;
    silhouette_score: number;
    inertia: number;
    curriculum_level: string;
  };
  points: ClusterPoint[];
  centroids: Centroid[];
}

interface DataScienceExplorerProps {
  currency: CurrencyCode;
  highlightVehicleId?: string;
}

export function DataScienceExplorer({ currency, highlightVehicleId }: DataScienceExplorerProps) {
  const [clusterData, setClusterData] = useState<ClusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<number | "all">("all");
  const [hoveredPoint, setHoveredPoint] = useState<ClusterPoint | null>(null);
  const [activeTab, setActiveTab] = useState<"scatter" | "mcdm" | "depreciation">("scatter");

  useEffect(() => {
    async function fetchClusters() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/simulate/clusters");
        if (res.ok) {
          const data = await res.json();
          setClusterData(data);
        }
      } catch (e) {
        console.error("Failed to load clustering data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchClusters();
  }, []);

  if (loading || !clusterData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest font-mono">Loading Data Science Analytics Hub...</p>
      </div>
    );
  }

  const filteredPoints =
    selectedCluster === "all"
      ? clusterData.points
      : clusterData.points.filter((p) => p.cluster_id === selectedCluster);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CpuIcon className="w-3.5 h-3.5" />
            <span>2nd-Year Data Science & Machine Learning Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Algorithmic Engine & K-Means Clustering Hub
          </h2>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/[0.04] border border-white/10 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("scatter")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === "scatter"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            2D K-Means Scatter
          </button>
          <button
            onClick={() => setActiveTab("mcdm")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === "mcdm"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            MCDM Decision Model
          </button>
          <button
            onClick={() => setActiveTab("depreciation")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === "depreciation"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sri Lanka TCO Decay Math
          </button>
        </div>
      </div>

      {/* TAB 1: 2D K-MEANS SCATTER PLOT */}
      {activeTab === "scatter" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual Scatter Plot Area (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3Icon className="w-4 h-4 text-cyan-400" />
                  <span>Unsupervised K-Means Feature Map (k=4)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  X-Axis: Engine Horsepower (HP) | Y-Axis: Fuel Economy (km/L)
                </p>
              </div>

              {/* Cluster Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedCluster("all")}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer ${
                    selectedCluster === "all"
                      ? "bg-white/15 text-white border-white/30"
                      : "bg-white/[0.03] text-slate-400 border-white/5 hover:text-white"
                  }`}
                >
                  All ({clusterData.points.length})
                </button>
                {clusterData.centroids.map((c) => (
                  <button
                    key={c.cluster_id}
                    onClick={() => setSelectedCluster(c.cluster_id)}
                    className={`px-2.5 py-1 rounded-lg border font-medium transition cursor-pointer flex items-center gap-1.5 ${
                      selectedCluster === c.cluster_id
                        ? "bg-white/15 text-white border-white/30"
                        : "bg-white/[0.03] text-slate-400 border-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    <span>{c.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Scatter Canvas */}
            <div className="relative w-full h-96 sm:h-[420px] bg-[#090d16]/90 border border-white/[0.08] rounded-2xl overflow-hidden p-4 select-none">
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-grid-tech opacity-40 pointer-events-none" />

              {/* Axis Labels */}
              <div className="absolute left-3 top-3 text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span>↑ High Fuel Economy (45 km/L)</span>
              </div>
              <div className="absolute left-3 bottom-3 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <span>↓ 8 km/L</span>
              </div>
              <div className="absolute right-3 bottom-3 text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>High Horsepower (550 HP) →</span>
              </div>

              {/* Render Centroids */}
              {clusterData.centroids.map((c) => (
                <div
                  key={`centroid-${c.cluster_id}`}
                  style={{ left: `${c.x_pct}%`, top: `${c.y_pct}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center"
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center animate-spin"
                    style={{ borderColor: c.color, animationDuration: "14s" }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                  </div>
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 mt-1 whitespace-nowrap shadow border"
                    style={{ color: c.color, borderColor: `${c.color}40` }}
                  >
                    μ{c.cluster_id + 1}: {c.center_horsepower}HP / {c.center_km_per_liter}km/L
                  </span>
                </div>
              ))}

              {/* Render Vehicle Data Points */}
              {filteredPoints.map((p) => {
                const isHovered = hoveredPoint?.id === p.id;
                const isMatched = highlightVehicleId === p.id;

                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ left: `${p.x_pct}%`, top: `${p.y_pct}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform cursor-pointer z-30 ${
                      isHovered || isMatched ? "scale-150 z-40" : "hover:scale-125"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all shadow-lg ${
                        isMatched
                          ? "ring-4 ring-amber-400 animate-ping"
                          : ""
                      }`}
                      style={{
                        backgroundColor: p.color,
                        borderColor: isHovered ? "#ffffff" : "rgba(255,255,255,0.4)",
                        boxShadow: `0 0 10px ${p.color}`,
                      }}
                    />
                  </div>
                );
              })}

              {/* Hover Tooltip Popup */}
              {hoveredPoint && (
                <div
                  style={{
                    left: `${Math.min(75, Math.max(25, hoveredPoint.x_pct))}%`,
                    top: `${Math.min(75, Math.max(25, hoveredPoint.y_pct))}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full -mt-4 z-50 pointer-events-none w-64 p-3 rounded-2xl bg-[#0b101c]/95 border border-white/20 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: hoveredPoint.color }}
                    />
                    <h4 className="text-xs font-bold text-white truncate">
                      {hoveredPoint.name} ({hoveredPoint.year})
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-1.5 font-mono mb-2">
                    <div>HP: <span className="text-white font-bold">{hoveredPoint.horsepower}</span></div>
                    <div>Economy: <span className="text-emerald-400 font-bold">{hoveredPoint.km_per_liter} km/L</span></div>
                    <div className="col-span-2">Price: <span className="text-cyan-300 font-bold">{formatCurrency(hoveredPoint.price_lkr, currency)}</span></div>
                  </div>
                  <div
                    className="text-[10px] font-medium px-2 py-1 rounded-lg border truncate"
                    style={{
                      backgroundColor: `${hoveredPoint.color}15`,
                      borderColor: `${hoveredPoint.color}35`,
                      color: hoveredPoint.color,
                    }}
                  >
                    {hoveredPoint.cluster_name}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Legend */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                N = {clusterData.points.length} Sri Lankan Vehicles Mapped
              </span>
              <span className="text-[11px] text-cyan-400">
                Hover any dot to inspect vehicle specs & cluster affiliation
              </span>
            </div>
          </div>

          {/* Academic Model Card & Centroid Descriptions (1 col) */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LayersIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Undergraduate Methodology
                </h3>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2.5 text-xs font-mono mb-6">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400">Algorithm</span>
                  <span className="text-white font-semibold">{clusterData.model_metadata.algorithm}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400">Feature Scaling</span>
                  <span className="text-cyan-300 font-semibold">{clusterData.model_metadata.preprocessing}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400">Silhouette Score</span>
                  <span className="text-emerald-400 font-bold">{clusterData.model_metadata.silhouette_score} (Valid)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-400">Model Inertia (WCSS)</span>
                  <span className="text-white font-semibold">{clusterData.model_metadata.inertia}</span>
                </div>
              </div>

              {/* 4 Archetype Explanations */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                Identified Market Archetypes:
              </h4>
              <div className="space-y-2">
                {clusterData.centroids.map((c) => (
                  <div
                    key={c.cluster_id}
                    className="p-2.5 rounded-xl border text-xs"
                    style={{
                      backgroundColor: `${c.color}10`,
                      borderColor: `${c.color}30`,
                    }}
                  >
                    <div className="flex items-center justify-between font-bold mb-1" style={{ color: c.color }}>
                      <span>{c.label}</span>
                      <span className="text-[10px] font-mono">{c.vehicle_count} cars</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] text-slate-400 flex items-center gap-2">
              <InfoIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Strictly uses standard scikit-learn K-Means & Euclidean Distance without black-box complexity.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-CRITERIA DECISION MODEL (MCDM) */}
      {activeTab === "mcdm" && (
        <div className="glass-panel p-8 rounded-3xl">
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl font-bold text-white mb-2">
              Multi-Criteria Decision Making (MCDM) Weighted Scoring Model
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In second-year Data Science, ranking alternatives under multiple conflicting constraints is solved using linear multi-attribute utility theory. The total suitability score S(v) is calculated as a normalized linear combination:
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/30 font-mono text-xs text-cyan-300 mb-8 overflow-x-auto shadow-inner">
            <code>
              Score(v) = (w_budget × S_budget) + (w_family × S_family) + (w_comfort × S_comfort) + (w_perf × S_perf) + (w_eff × S_efficiency) + Bonuses
            </code>
            <div className="text-[11px] text-slate-400 mt-2">
              Constraint: ∑ w_i = 1.0 (Linear Convex Combination) | S_i ∈ [0, 100]
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Budget Match</div>
              <div className="text-2xl font-black text-white font-mono">30%</div>
              <p className="text-[11px] text-slate-400 mt-1">Evaluates proximity to the user&apos;s exact LKR capital limit.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Comfort & Luxury</div>
              <div className="text-2xl font-black text-white font-mono">25%</div>
              <p className="text-[11px] text-slate-400 mt-1">NVH cabin isolation, suspension refinement, leather ergonomics.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Performance</div>
              <div className="text-2xl font-black text-white font-mono">20%</div>
              <p className="text-[11px] text-slate-400 mt-1">Horsepower (HP), torque (Nm), and acceleration response.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Family Seating</div>
              <div className="text-2xl font-black text-white font-mono">15%</div>
              <p className="text-[11px] text-slate-400 mt-1">Passenger capacity and boot space volume (Liters).</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Fuel Economy</div>
              <div className="text-2xl font-black text-white font-mono">10%</div>
              <p className="text-[11px] text-slate-400 mt-1">Daily commute stress evaluated against Sri Lankan fuel price (Rs. 368/L).</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SRI LANKA TCO DEPRECIATION MATH */}
      {activeTab === "depreciation" && (
        <div className="glass-panel p-8 rounded-3xl">
          <div className="max-w-3xl mb-8">
            <h3 className="text-xl font-bold text-white mb-2">
              Parametric Depreciation & Sri Lankan Resale Retention Math
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Unlike Western markets where all cars depreciate rapidly, the Sri Lankan automotive market exhibits tiered depreciation rates driven by import duty structures, parts availability, and secondary market demand.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090d16] border border-blue-500/30 font-mono text-xs text-blue-300 mb-8 shadow-inner overflow-x-auto">
            <code>
              Resale_Value(t) = Purchase_Price × ∏ [ 1 - d_k(tier, annual_km) ]
            </code>
            <div className="text-[11px] text-slate-400 mt-2">
              Where d_k is the annual decay coefficient calibrated by brand tier in Sri Lanka.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tier 1: High Retention</span>
              <h4 className="text-base font-bold text-white mt-1">Toyota & Suzuki Models</h4>
              <div className="text-2xl font-black text-emerald-300 font-mono my-2">~4-7% Decay/yr</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Premio, Aqua, Wagon R, and Prado maintain phenomenal value in Sri Lanka due to widespread spare parts and high liquidity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Tier 2: Moderate Retention</span>
              <h4 className="text-base font-bold text-white mt-1">Honda, BYD & Tesla</h4>
              <div className="text-2xl font-black text-cyan-300 font-mono my-2">~7-10% Decay/yr</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vezel and modern EVs experience standard depreciation, offset by ultra-low running fuel costs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Tier 3: European Luxury</span>
              <h4 className="text-base font-bold text-white mt-1">BMW, Mercedes, Audi & Porsche</h4>
              <div className="text-2xl font-black text-amber-300 font-mono my-2">~10-14% Decay/yr</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Higher initial luxury import price with steeper maintenance curves, ideal for buyers prioritizing executive status over resale profit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
