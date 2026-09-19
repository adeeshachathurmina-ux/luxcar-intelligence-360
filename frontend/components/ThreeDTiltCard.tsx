"use client";

import React, { useRef, useState } from "react";

interface ThreeDTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees (default 8)
  onClick?: () => void;
}

/**
 * 3D Perspective Tilt Card that reacts smoothly to mouse movements over vehicle cards.
 * Produces a physical, tactile 3D hover response with dynamic surface shine.
 */
export function ThreeDTiltCard({
  children,
  className = "",
  maxTilt = 8,
  onClick,
}: ThreeDTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (((y - centerY) / centerY) * -maxTilt).toFixed(2);
    const rotateY = (((x - centerX) / centerX) * maxTilt).toFixed(2);

    cardRef.current.style.setProperty("--card-mouse-x", `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty("--card-mouse-y", `${(y / rect.height) * 100}%`);

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? "transform 0.1s ease-out, box-shadow 0.2s ease"
          : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease",
      }}
      className={`card-3d relative cursor-pointer ${className}`}
    >
      <div className="card-3d-shine" />
      <div className="card-3d-content relative z-10 h-full">{children}</div>
    </div>
  );
}
