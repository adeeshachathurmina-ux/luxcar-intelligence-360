"use client";

import React, { useState, useRef, useEffect } from "react";
import { SparklesIcon, SendIcon, XIcon } from "./Icons";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  horsepower: number;
  fuel_type: string;
  boot_space_liters: number;
  base_price_usd: number;
  annual_maintenance_usd: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentVehicle: Vehicle | null;
}

export function AIChatDrawer({ isOpen, onClose, currentVehicle }: AIChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: currentVehicle
        ? `Hello! I am LuxAI, your personal automotive consultant. I'm ready to answer any questions about the ${currentVehicle.brand} ${currentVehicle.model} or your ownership scenario.\n(සිංහල, Singlish හෝ English ඕනෑම භාෂාවකින් අසන්න!)`
        : "Hello! I am LuxAI, your personal automotive consultant. Ask me any car question in English, සිංහල (Sinhala), or Singlish! Tell me your budget or travel needs to get instant recommendations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keyStatus, setKeyStatus] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/set-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey.trim() }),
      });
      if (res.ok) {
        setKeyStatus("✓ Gemini AI Live Key Connected!");
        setTimeout(() => setShowKeyInput(false), 1500);
      } else {
        setKeyStatus("Could not update key.");
      }
    } catch (e) {
      setKeyStatus("Backend connection failed.");
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          current_vehicle: currentVehicle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Apologies, could not retrieve advice. Please try again." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection timed out. Please ensure the backend server is running." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "I have 18M budget, daily 35km travel, need a hybrid SUV",
    "ලක්ෂ 150කට පවුලට හොඳ hybrid SUV එකක් කියන්න",
    "What is the annual maintenance cost in Sri Lanka?",
    "ළමා ආසන (Child Seats) 2ක් දාන්න පුළුවන්ද?",
    "How does its 3-year resale value compare to Toyota?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-[#080b11] border-l border-white/10 flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <SparklesIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>LuxAI Concierge</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentVehicle ? `${currentVehicle.brand} ${currentVehicle.model}` : "Multi-Lingual Automotive Intelligence"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] text-amber-300 font-semibold transition cursor-pointer"
              title="Google Gemini Cloud Key Settings"
            >
              🔑 Live AI
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Drawer dropdown */}
        {showKeyInput && (
          <div className="p-3 bg-blue-950/40 border-b border-blue-500/20 text-xs">
            <span className="text-slate-300 block mb-1 font-semibold">
              Connect Google Gemini Live Key (Optional):
            </span>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Paste AI Studio API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs cursor-pointer shrink-0"
              >
                Connect
              </button>
            </div>
            {keyStatus && (
              <span className="text-[10px] text-emerald-400 block mt-1">{keyStatus}</span>
            )}
            <span className="text-[10px] text-slate-400 block mt-1">
              Works 100% offline even without a key!
            </span>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white/[0.05] border border-white/10 text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <span className="text-xs">LuxAI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01]">
          <span className="text-[10px] text-slate-500 font-semibold block mb-1.5">
            Quick Inquiries (English &amp; සිංහල):
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-blue-500/10 border border-white/[0.08] hover:border-blue-500/30 text-slate-300 hover:text-blue-300 transition whitespace-nowrap cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything in English, සිංහල or Singlish..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
