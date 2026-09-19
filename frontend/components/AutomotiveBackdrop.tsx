"use client";

import React, { useEffect, useRef, useState } from "react";
import { soundFX } from "./AudioEffects";

export type BackdropMode = "highway" | "cyber" | "warp" | "golden";

/**
 * Creative Master-Dev Automotive Visual Engine & Live Cockpit Telemetry HUD:
 * 1. 4 Switchable Cinematic Modes:
 *    - 🌌 Southern Expressway Midnight (HD Moving Traffic + Photon Speed Streaks)
 *    - 🏙️ Neo Colombo Cyber 2077 (3D Perspective Cyber Grid + Lotus Tower Neon Silhouette)
 *    - ⚡ Hyper Warp Velocity (3D Starfield Hyperjump with Mouse Parallax)
 *    - 🌅 Galle Marine Golden Hour (Sunset Coastal Expressway with Specular Amber Glow)
 * 2. Live Interactive Digital Cockpit Telemetry HUD (Speedometer, RPM, G-Force Vector, Ambient Audio).
 */
export function AutomotiveBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<BackdropMode>("highway");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [hudOpen, setHudOpen] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Simulated live telemetry state
  const [telemetry, setTelemetry] = useState({
    speedKmh: 94,
    rpm: 2450,
    gear: "D5",
    gForceX: 0.05,
    gForceY: 0.12,
    batteryPct: 88,
  });

  // Guarantee video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = () => {
      video.muted = true;
      video
        .play()
        .then(() => setVideoPlaying(true))
        .catch(() => {});
    };

    startPlayback();

    const handleFirstClick = () => {
      if (video.paused) {
        video.play().then(() => setVideoPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("pointerdown", handleFirstClick, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstClick);
    };
  }, [mode]);

  // Live Telemetry fluctuation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const deltaSpeed = (Math.random() - 0.48) * 3;
        const newSpeed = Math.max(65, Math.min(135, Math.round(prev.speedKmh + deltaSpeed)));
        const newRpm = Math.round(1800 + (newSpeed / 135) * 2600 + (Math.random() - 0.5) * 80);
        let gear = "D4";
        if (newSpeed > 110) gear = "D6";
        else if (newSpeed > 85) gear = "D5";
        else if (newSpeed > 60) gear = "D4";

        return {
          speedKmh: newSpeed,
          rpm: newRpm,
          gear,
          gForceX: Number(((Math.random() - 0.5) * 0.25).toFixed(2)),
          gForceY: Number((0.08 + Math.random() * 0.15).toFixed(2)),
          batteryPct: prev.batteryPct,
        };
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  // Canvas visual rendering engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let currentMouseX = width / 2;
    let currentMouseY = height / 2;
    let lastMouseX = width / 2;
    let mouseSpeed = 1;

    const handlePointer = (e: PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      const dx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
      mouseSpeed = Math.min(3.5, 1 + Math.abs(dx) * 0.04);
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    let highwayOffset = 0;

    // Warp Stars
    const stars: {
      x: number;
      y: number;
      z: number;
      pz: number;
      color: string;
    }[] = [];

    const starColors = ["#38bdf8", "#818cf8", "#34d399", "#f472b6", "#ffffff"];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: Math.random() * width,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Speed streaks
    const streaks: {
      x: number;
      y: number;
      length: number;
      speed: number;
      color: string;
      alpha: number;
    }[] = [];

    const streakColors = ["#3b82f6", "#06b6d4", "#f59e0b", "#60a5fa", "#10b981", "#ec4899"];
    for (let i = 0; i < 50; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 60 + Math.random() * 180,
        speed: 2 + Math.random() * 5,
        color: streakColors[Math.floor(Math.random() * streakColors.length)],
        alpha: 0.25 + Math.random() * 0.45,
      });
    }

    // Golden dust particles
    const dustParticles: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2.5,
        vx: 0.4 + Math.random() * 0.8,
        vy: -0.2 - Math.random() * 0.5,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }

    const render = () => {
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      mouseSpeed += (1 - mouseSpeed) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.54;
      const vanishingX = width / 2 + (currentMouseX - width / 2) * 0.12;

      // -------------------------------------------------------------
      // MODE 1: CYBER COLOMBO 2077
      // -------------------------------------------------------------
      if (mode === "cyber") {
        highwayOffset = (highwayOffset + 3.8 * mouseSpeed) % 65;

        // Glowing horizon
        const horizonGrad = ctx.createRadialGradient(
          vanishingX,
          horizonY,
          10,
          vanishingX,
          horizonY,
          width * 0.55
        );
        horizonGrad.addColorStop(0, "rgba(59, 130, 246, 0.28)");
        horizonGrad.addColorStop(0.35, "rgba(6, 182, 212, 0.12)");
        horizonGrad.addColorStop(0.7, "rgba(236, 72, 153, 0.05)");
        horizonGrad.addColorStop(1, "transparent");
        ctx.fillStyle = horizonGrad;
        ctx.fillRect(0, 0, width, height);

        // Lotus Tower Silhouette on Horizon
        ctx.save();
        const lotusX = vanishingX + 60;
        const lotusY = horizonY - 100;
        ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
        ctx.lineWidth = 1.5;
        // Spire & Petals
        ctx.beginPath();
        ctx.moveTo(lotusX, horizonY);
        ctx.lineTo(lotusX, lotusY);
        ctx.lineTo(lotusX - 12, lotusY + 28);
        ctx.lineTo(lotusX + 12, lotusY + 28);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "rgba(236, 72, 153, 0.5)";
        ctx.beginPath();
        ctx.arc(lotusX, lotusY + 28, 9, 0, Math.PI * 2);
        ctx.fill();

        // Spire tip light
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(lotusX, lotusY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3D Perspective Road Grid
        const roadTopWidth = width * 0.12;
        const roadBottomWidth = width * 0.88;

        ctx.save();
        // Perspective Scrolling Dashes
        for (let i = 0; i < 12; i++) {
          const depth = (i * 55 + highwayOffset * 1.8) % 650;
          const py = horizonY + Math.pow(depth / 650, 2.2) * (height - horizonY);
          const pLen = 14 + Math.pow(depth / 650, 2) * 55;
          const pAlpha = (py - horizonY) / (height - horizonY);

          ctx.strokeStyle = `rgba(245, 158, 11, ${0.7 * pAlpha})`;
          ctx.lineWidth = 2 + Math.pow(depth / 650, 2) * 4;
          ctx.beginPath();
          ctx.moveTo(vanishingX, py);
          ctx.lineTo(vanishingX, py + pLen);
          ctx.stroke();
        }

        // Road Curbs
        ctx.strokeStyle = "rgba(59, 130, 246, 0.55)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(vanishingX - roadTopWidth / 2, horizonY);
        ctx.lineTo(vanishingX - roadBottomWidth / 2, height);
        ctx.moveTo(vanishingX + roadTopWidth / 2, horizonY);
        ctx.lineTo(vanishingX + roadBottomWidth / 2, height);
        ctx.stroke();
        ctx.restore();

        // Speed Streaks
        for (let s of streaks) {
          s.x += s.speed * mouseSpeed * 1.3;
          if (s.x - s.length > width) {
            s.x = -s.length;
            s.y = Math.random() * height;
          }

          const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.7, s.color);
          grad.addColorStop(1, "white");

          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length, s.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // MODE 2: SOUTHERN EXPRESSWAY MIDNIGHT
      // -------------------------------------------------------------
      else if (mode === "highway") {
        for (let s of streaks) {
          s.x += s.speed * 1.1;
          if (s.x - s.length > width) {
            s.x = -s.length;
            s.y = Math.random() * height;
          }

          const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.length * 0.85, s.y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.8, s.color);
          grad.addColorStop(1, "white");

          ctx.save();
          ctx.globalAlpha = s.alpha * 0.75;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x + s.length * 0.85, s.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // MODE 3: HYPER WARP VELOCITY
      // -------------------------------------------------------------
      else if (mode === "warp") {
        const warpSpeed = 16 * mouseSpeed;
        const cx = width / 2;
        const cy = height / 2;

        ctx.save();
        for (let star of stars) {
          star.pz = star.z;
          star.z -= warpSpeed;

          if (star.z <= 0) {
            star.z = width;
            star.pz = width;
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
          }

          const k = 260 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          const pk = 260 / star.pz;
          const prevX = star.x * pk + cx;
          const prevY = star.y * pk + cy;

          const alpha = Math.min(1, (1 - star.z / width) * 1.6);

          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.max(1, (1 - star.z / width) * 3.5);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // MODE 4: GALLE MARINE GOLDEN HOUR
      // -------------------------------------------------------------
      else if (mode === "golden") {
        // Warm horizon glow
        const goldenGrad = ctx.createLinearGradient(0, horizonY - 120, 0, height);
        goldenGrad.addColorStop(0, "rgba(245, 158, 11, 0.12)");
        goldenGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.06)");
        goldenGrad.addColorStop(1, "transparent");
        ctx.fillStyle = goldenGrad;
        ctx.fillRect(0, 0, width, height);

        // Floating sun dust motes
        for (let p of dustParticles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;

          ctx.save();
          ctx.fillStyle = "rgba(251, 191, 36, " + p.alpha + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointer);
      cancelAnimationFrame(animId);
    };
  }, [mode]);

  const handleSelectMode = (newMode: BackdropMode) => {
    soundFX.playChime();
    setMode(newMode);
  };

  const handleToggleAudio = () => {
    const next = !ambientAudio;
    setAmbientAudio(next);
    soundFX.toggleAmbientHighway(next);
    soundFX.playClick();
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* 1. Looping Local Automotive Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 filter contrast-125 brightness-95 scale-105 ${
            mode === "highway"
              ? "opacity-55"
              : mode === "cyber"
              ? "opacity-40"
              : mode === "golden"
              ? "opacity-60 saturate-150"
              : "opacity-20"
          }`}
        >
          <source src={mode === "golden" ? "/videos/traffic_dusk.webm" : "/videos/night_drive.webm"} type="video/webm" />
          <source src="/videos/traffic_dusk.webm" type="video/webm" />
        </video>

        {/* 2. Sleek Translucent Vignette */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            mode === "golden"
              ? "bg-gradient-to-b from-[#0e0a06]/70 via-[#0e0a06]/45 to-[#0e0a06]/80"
              : "bg-gradient-to-b from-[#06080e]/65 via-[#06080e]/40 to-[#06080e]/75"
          } backdrop-blur-[0.5px]`}
        />

        {/* 3. Ambient Pulsing Headlight & Taillight Beams */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[34rem] h-[34rem] bg-cyan-500/12 rounded-full blur-3xl animate-float-gentle" />
        <div className="absolute top-2/3 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        {/* 4. Canvas Visual Overlays */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* 5. Interactive Theme Mode Switcher & Telemetry HUD Dock (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 no-print flex flex-col gap-2">
        {/* Expanded Live Cockpit Telemetry HUD */}
        {hudOpen && (
          <div className="p-4 rounded-3xl bg-[#0a0e1a]/95 backdrop-blur-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/20 text-xs w-72 mb-1 animate-fade-in-up">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                  Cockpit Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">LIVE E01</span>
            </div>

            {/* Speed & RPM Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[9px] text-slate-400">SPEED</div>
                <div className="text-lg font-black text-white font-mono leading-none my-1">
                  {telemetry.speedKmh}
                </div>
                <div className="text-[9px] text-cyan-400 font-bold">KM/H</div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[9px] text-slate-400">ENGINE</div>
                <div className="text-lg font-black text-amber-400 font-mono leading-none my-1">
                  {telemetry.rpm}
                </div>
                <div className="text-[9px] text-amber-300 font-bold">RPM</div>
              </div>

              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-[9px] text-slate-400">GEAR</div>
                <div className="text-lg font-black text-emerald-400 font-mono leading-none my-1">
                  {telemetry.gear}
                </div>
                <div className="text-[9px] text-slate-400 font-bold">AUTO</div>
              </div>
            </div>

            {/* G-Force & Hybrid Battery */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px]">G-Force:</span>
                <span className="font-mono font-bold text-white text-[11px]">
                  {telemetry.gForceY}g
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px]">Battery:</span>
                <span className="font-mono font-bold text-emerald-400 text-[11px]">
                  {telemetry.batteryPct}%
                </span>
              </div>
            </div>

            {/* Ambient Highway Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                ambientAudio
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
              }`}
            >
              <span>{ambientAudio ? "🔊" : "🔈"}</span>
              <span>{ambientAudio ? "Highway Audio: Active" : "Enable Highway Ambience"}</span>
            </button>
          </div>
        )}

        {/* Bottom Bar: Mode Pills + HUD Trigger */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-[#0a0e1a]/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/25">
          <button
            type="button"
            onClick={() => handleSelectMode("highway")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "highway"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Southern Expressway Midnight Video"
          >
            <span>🌌</span>
            <span className="hidden sm:inline">Midnight</span>
            {mode === "highway" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("cyber")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "cyber"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Neo Colombo 2077 Cyber Grid with Lotus Tower"
          >
            <span>🏙️</span>
            <span className="hidden sm:inline">Cyber Colombo</span>
            {mode === "cyber" && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("golden")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "golden"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Galle Marine Golden Hour Coastal Drive"
          >
            <span>🌅</span>
            <span className="hidden sm:inline">Golden Hour</span>
            {mode === "golden" && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("warp")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === "warp"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Hyper Warp Speed Starfield"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">Hyper Warp</span>
            {mode === "warp" && <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" />}
          </button>

          {/* Toggle HUD Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setHudOpen(!hudOpen);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
              hudOpen
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle Live Cockpit Telemetry HUD"
          >
            <span>📊</span>
            <span className="hidden md:inline">HUD</span>
          </button>
        </div>
      </div>
    </>
  );
}
