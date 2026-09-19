"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Ultra-Fast High-Tech Automotive Cursor & Dynamic Ambient Spotlight:
 * 1. Zero-lag, 1:1 instantaneous hardware tracking for the precision center dot.
 * 2. Snappy 60 FPS HUD reticle with 4 automotive crosshair tick marks.
 * 3. Magnetic state transformation (turns electric gold/amber on hover over clickable items).
 * 4. Ambient radial light beam following the cursor across the dark surfaces.
 */
export function MouseSpotlight() {
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const root = document.documentElement;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      // Instant 1:1 hardware update for the center dot (ZERO LAG!)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      // Update CSS variables for spotlights
      root.style.setProperty("--mouse-x", `${targetX}px`);
      root.style.setProperty("--mouse-y", `${targetY}px`);

      // Fast check if over interactive elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest('[role="button"]') ||
          target.classList.contains("cursor-pointer") ||
          target.closest(".card-3d") ||
          window.getComputedStyle(target).cursor === "pointer")
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    const handlePointerDown = () => setIsClicking(true);
    const handlePointerUp = () => setIsClicking(false);

    const handlePointerLeave = () => {
      setIsVisible(false);
      setIsHoveringClickable(false);
    };

    // Ultra-snappy lerp physics (0.55 factor ensures swift, energetic follow without sluggishness)
    const animate = () => {
      currentX += (targetX - currentX) * 0.55;
      currentY += (targetY - currentY) * 0.55;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* 1. Ambient Background Spotlight Beam */}
      <div className="mouse-spotlight" aria-hidden="true" />

      {/* 2. Zero-Lag Precision Center Dot (Desktop only) */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9999] hidden md:block will-change-transform transition-opacity duration-150 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-150 ${
            isClicking
              ? "scale-75 bg-white shadow-md shadow-white"
              : isHoveringClickable
              ? "scale-125 bg-amber-400 shadow-lg shadow-amber-400/80"
              : "scale-100 bg-cyan-400 shadow-md shadow-cyan-400/80"
          }`}
        />
      </div>

      {/* 3. Automotive Precision HUD Reticle */}
      <div
        ref={reticleRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-[9998] hidden md:block will-change-transform transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`relative rounded-full transition-all duration-150 ease-out flex items-center justify-center ${
            isClicking
              ? "w-8 h-8 -translate-x-4 -translate-y-4 border-2 border-white bg-white/20 shadow-xl shadow-cyan-400/50"
              : isHoveringClickable
              ? "w-11 h-11 -translate-x-[22px] -translate-y-[22px] border border-amber-400/80 bg-amber-400/10 shadow-lg shadow-amber-400/30 backdrop-blur-[0.5px]"
              : "w-7 h-7 -translate-x-3.5 -translate-y-3.5 border border-cyan-400/40 bg-cyan-400/5"
          }`}
        >
          {/* Precision Crosshair Ticks (Automotive HUD feel) */}
          <span
            className={`absolute -top-1 w-1.5 h-[1.5px] rounded-full transition-colors ${
              isHoveringClickable ? "bg-amber-400" : "bg-cyan-400/60"
            }`}
          />
          <span
            className={`absolute -bottom-1 w-1.5 h-[1.5px] rounded-full transition-colors ${
              isHoveringClickable ? "bg-amber-400" : "bg-cyan-400/60"
            }`}
          />
          <span
            className={`absolute -left-1 w-[1.5px] h-1.5 rounded-full transition-colors ${
              isHoveringClickable ? "bg-amber-400" : "bg-cyan-400/60"
            }`}
          />
          <span
            className={`absolute -right-1 w-[1.5px] h-1.5 rounded-full transition-colors ${
              isHoveringClickable ? "bg-amber-400" : "bg-cyan-400/60"
            }`}
          />
        </div>
      </div>
    </>
  );
}
