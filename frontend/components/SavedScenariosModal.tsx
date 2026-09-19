"use client";

import React from "react";
import { XIcon, CarIcon, SparklesIcon } from "./Icons";
import { CurrentParams, FutureParams } from "./SimulatorControls";

export interface SavedScenario {
  id: string;
  name: string;
  timestamp: string;
  current: CurrentParams;
  future: FutureParams;
  topMatchName?: string;
}

interface SavedScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedScenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
  onSaveCurrentScenario: () => void;
}

export function SavedScenariosModal({
  isOpen,
  onClose,
  savedScenarios,
  onLoadScenario,
  onDeleteScenario,
  onSaveCurrentScenario,
}: SavedScenariosModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-panel p-6 rounded-3xl relative glow-sapphire">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              💾
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Your Saved Scenarios</h3>
              <p className="text-[11px] text-slate-400">Stored locally in your browser session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Save Current Action */}
        <div className="mb-4">
          <button
            onClick={onSaveCurrentScenario}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
          >
            <span>+ Bookmark Current Simulation Scenario</span>
          </button>
        </div>

        {/* List of Saved Scenarios */}
        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {savedScenarios.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No saved scenarios yet. Click the button above to bookmark your current configuration.
            </div>
          ) : (
            savedScenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-between gap-3 transition"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{sc.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Budget: ${sc.current.budget.toLocaleString()} • {sc.future.planning_years}y Horizon • {sc.timestamp}
                  </p>
                  {sc.topMatchName && (
                    <span className="inline-block mt-1 text-[10px] text-blue-300 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      Match: {sc.topMatchName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadScenario(sc);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-xs font-semibold text-blue-200 hover:text-white transition cursor-pointer"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDeleteScenario(sc.id)}
                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
