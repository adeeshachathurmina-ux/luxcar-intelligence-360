"use client";

import React, { useEffect, useRef, useState } from "react";
import { soundFX } from "./AudioEffects";
import { XIcon, SparklesIcon, CarIcon, ZapIcon } from "./Icons";

interface HighwayRushGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FleetVehicle {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  accent: string;
  baseSpeed: number;
  topSpeed: number;
  nitroSpeed: number;
  fuelRate: number;
  handling: number;
  specialPerk: string;
  icon: string;
}

const FLEET_CARS: FleetVehicle[] = [
  {
    id: "wagonr",
    name: "Suzuki Wagon R",
    subtitle: "MH55S FZ Hybrid",
    color: "#06b6d4",
    accent: "#67e8f9",
    baseSpeed: 75,
    topSpeed: 105,
    nitroSpeed: 140,
    fuelRate: 0.07,
    handling: 9,
    specialPerk: "Ultra Low Fuel Consumption (24 km/L)",
    icon: "🚗",
  },
  {
    id: "vezel",
    name: "Honda Vezel",
    subtitle: "e:HEV Z Crossover",
    color: "#3b82f6",
    accent: "#93c5fd",
    baseSpeed: 90,
    topSpeed: 120,
    nitroSpeed: 165,
    fuelRate: 0.11,
    handling: 9,
    specialPerk: "Balanced Hybrid Regeneration",
    icon: "🚙",
  },
  {
    id: "prado",
    name: "Toyota Prado 4x4",
    subtitle: "LC250 / TX-L Diesel",
    color: "#f59e0b",
    accent: "#fde68a",
    baseSpeed: 95,
    topSpeed: 125,
    nitroSpeed: 160,
    fuelRate: 0.16,
    handling: 7,
    specialPerk: "Heavy Tank: Smashes through Cones!",
    icon: "🛞",
  },
  {
    id: "bmw",
    name: "BMW M340i xDrive",
    subtitle: "382 HP Twin-Power Turbo",
    color: "#8b5cf6",
    accent: "#c4b5fd",
    baseSpeed: 110,
    topSpeed: 145,
    nitroSpeed: 195,
    fuelRate: 0.17,
    handling: 10,
    specialPerk: "Precision High-Speed Overtaking",
    icon: "🏎️",
  },
  {
    id: "byd",
    name: "BYD Seal AWD",
    subtitle: "523 HP Dual Motor EV",
    color: "#10b981",
    accent: "#6ee7b7",
    baseSpeed: 105,
    topSpeed: 140,
    nitroSpeed: 190,
    fuelRate: 0.09,
    handling: 9,
    specialPerk: "Instant Electric KERS Acceleration",
    icon: "⚡",
  },
  {
    id: "porsche",
    name: "Porsche Macan GTS",
    subtitle: "434 HP 2.9L Twin-Turbo",
    color: "#ec4899",
    accent: "#fbcfe8",
    baseSpeed: 120,
    topSpeed: 155,
    nitroSpeed: 215,
    fuelRate: 0.19,
    handling: 10,
    specialPerk: "Maximum Top Speed & Dual Exhaust Flames",
    icon: "🏁",
  },
];

interface Entity {
  id: number;
  lane: number; // -1: left, 0: center, 1: right
  x: number;
  z: number; // depth: 1000 = horizon, 0 = player
  type: "tuktuk" | "bus" | "police" | "cone" | "pothole" | "fuel" | "coin" | "nitro" | "shield";
  speed: number;
  slogan?: string;
  passedPlayer?: boolean;
}

export function HighwayRushGame({ isOpen, onClose }: HighwayRushGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCar, setSelectedCar] = useState<FleetVehicle>(FLEET_CARS[1]);
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [nitroGauge, setNitroGauge] = useState(100);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [moneySaved, setMoneySaved] = useState(0);
  const [nearMissCombo, setNearMissCombo] = useState(0);
  const [nearMissBanner, setNearMissBanner] = useState<string | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [musicOn, setMusicOn] = useState(true);

  // Load highscore
  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxcar_highway_rush_highscore_v2");
      if (stored) setHighScore(Number(stored));
    } catch (e) {}
  }, []);

  // Keyboard and Game Loop
  useEffect(() => {
    if (!isOpen || gameState !== "playing") {
      soundFX.toggleSynthwaveBeat(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 460);
    const height = (canvas.height = 620);
    const horizonY = 175;

    // Player position
    let currentLane = 0; // -1, 0, 1
    let targetX = 0;
    let playerX = 0;
    const playerY = height - 90;

    // Game stats
    let currentSpeed = selectedCar.baseSpeed;
    let currentFuel = 100;
    let currentNitro = 100;
    let nitroActive = false;
    let shieldActive = false;
    let currentMoney = 0;
    let currentDistance = 0;
    let localScore = 0;
    let combo = 0;
    let cameraShake = 0;
    let curveAngle = 0;
    let curveTarget = 0;
    let curveTimer = 0;

    if (musicOn) {
      soundFX.toggleSynthwaveBeat(true);
    }

    // Roadside sceneries
    const palmTrees: { side: -1 | 1; z: number }[] = [];
    for (let i = 0; i < 12; i++) {
      palmTrees.push({
        side: i % 2 === 0 ? -1 : 1,
        z: (i * 90) % 1000,
      });
    }

    // Overhead gantry signs
    const gantries: { z: number; text: string }[] = [
      { z: 600, text: "SOUTHERN EXPRESSWAY - E01" },
      { z: 1200, text: "GALLE / MATARA EXITS" },
      { z: 1800, text: "SPEED LIMIT 100 KM/H" },
    ];

    // Entities (Traffic & Items)
    const entities: Entity[] = [];
    let entityIdCounter = 0;
    let spawnTimer = 0;

    const tuktukSlogans = ["MOM'S BLESSING", "KING OF ROAD", "NO HORN PLS", "ALTO BEATER", "BABY ON BOARD"];

    const spawnEntity = () => {
      const lane = [-1, 0, 1][Math.floor(Math.random() * 3)];
      const rand = Math.random();
      let type: Entity["type"] = "tuktuk";
      let entSpeed = 35;
      let slogan = "";

      if (rand < 0.28) {
        type = "tuktuk";
        entSpeed = 40 + Math.random() * 15;
        slogan = tuktukSlogans[Math.floor(Math.random() * tuktukSlogans.length)];
      } else if (rand < 0.50) {
        type = "bus";
        entSpeed = 55 + Math.random() * 15;
      } else if (rand < 0.62) {
        type = "police";
        entSpeed = 70 + Math.random() * 10;
      } else if (rand < 0.72) {
        type = "cone";
        entSpeed = 0;
      } else if (rand < 0.82) {
        type = "coin";
        entSpeed = 0;
      } else if (rand < 0.92) {
        type = "fuel";
        entSpeed = 0;
      } else if (rand < 0.97) {
        type = "nitro";
        entSpeed = 0;
      } else {
        type = "shield";
        entSpeed = 0;
      }

      entities.push({
        id: ++entityIdCounter,
        lane,
        x: 0,
        z: 1000,
        type,
        speed: entSpeed,
        slogan,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (currentLane > -1) {
          currentLane--;
          soundFX.playClick();
          soundFX.playTireScreech();
        }
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (currentLane < 1) {
          currentLane++;
          soundFX.playClick();
          soundFX.playTireScreech();
        }
      } else if (e.key === " " || e.key === "Shift") {
        // Nitro trigger
        if (currentNitro > 20 && !nitroActive) {
          nitroActive = true;
          setIsNitroActive(true);
          soundFX.playEngineRev();
          soundFX.playTurboBlowoff(0.18);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let roadScroll = 0;

    // --- GAME LOOP ---
    const loop = () => {
      // Curve change
      curveTimer++;
      if (curveTimer > 180) {
        curveTimer = 0;
        curveTarget = (Math.random() - 0.5) * 70;
      }
      curveAngle += (curveTarget - curveAngle) * 0.02;

      // Handle Nitro
      if (nitroActive) {
        currentSpeed = selectedCar.nitroSpeed;
        currentNitro -= 0.65;
        cameraShake = 3.5;
        if (currentNitro <= 0) {
          currentNitro = 0;
          nitroActive = false;
          setIsNitroActive(false);
          soundFX.playTurboBlowoff(0.08);
        }
      } else {
        currentSpeed += (selectedCar.baseSpeed - currentSpeed) * 0.08;
        currentNitro = Math.min(100, currentNitro + 0.08);
        cameraShake = Math.max(0, cameraShake - 0.15);
      }

      setNitroGauge(Math.round(currentNitro));
      setSpeedKmh(Math.round(currentSpeed));

      // Fuel consumption
      currentFuel -= selectedCar.fuelRate * (currentSpeed / 90) * 0.12;
      if (currentFuel <= 0) {
        currentFuel = 0;
        endGame("Fuel Tank Empty!");
        return;
      }

      currentDistance += currentSpeed * 0.00015;
      localScore = Math.floor(currentDistance * 120 + currentMoney * 0.04 + combo * 100);

      setFuel(Math.round(currentFuel));
      setDistanceKm(Number(currentDistance.toFixed(2)));
      setScore(localScore);

      // Smooth player steering
      targetX = currentLane * 115;
      playerX += (targetX - playerX) * 0.22;

      // Road scroll
      roadScroll = (roadScroll + currentSpeed * 0.12) % 60;

      // Spawning entities
      spawnTimer++;
      const spawnInterval = Math.max(28, 55 - Math.floor(currentDistance * 2));
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        spawnEntity();
      }

      // Camera shake offset
      const shakeX = (Math.random() - 0.5) * cameraShake;
      const shakeY = (Math.random() - 0.5) * cameraShake;

      // -----------------------------------------------------------
      // 1. SKY & HORIZON (Colombo Lotus Tower Silhouette & Synthwave Sun)
      // -----------------------------------------------------------
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, "#080b14");
      skyGrad.addColorStop(0.6, "#14132b");
      skyGrad.addColorStop(1, "#311847");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // Distant Synthwave Sun
      const sunGrad = ctx.createRadialGradient(width / 2 + curveAngle * 0.5, horizonY, 5, width / 2 + curveAngle * 0.5, horizonY, 55);
      sunGrad.addColorStop(0, "rgba(251, 191, 36, 0.9)");
      sunGrad.addColorStop(0.4, "rgba(244, 63, 94, 0.75)");
      sunGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(width / 2 + curveAngle * 0.5, horizonY, 55, Math.PI, 0, false);
      ctx.fill();

      // Colombo Lotus Tower & Skyline
      const lotusX = width / 2 + 55 + curveAngle * 0.4;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(lotusX, horizonY);
      ctx.lineTo(lotusX, horizonY - 60);
      ctx.lineTo(lotusX - 8, horizonY - 40);
      ctx.lineTo(lotusX + 8, horizonY - 40);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = "rgba(236, 72, 153, 0.75)";
      ctx.beginPath();
      ctx.arc(lotusX, horizonY - 40, 6, 0, Math.PI * 2);
      ctx.fill();

      // Skyline buildings
      ctx.fillStyle = "#0c101c";
      for (let b = -4; b <= 4; b++) {
        const bx = width / 2 + b * 45 + curveAngle * 0.3;
        const bh = 15 + Math.abs(b * 7) % 28;
        ctx.fillRect(bx, horizonY - bh, 35, bh);
      }

      // -----------------------------------------------------------
      // 2. 3D PERSPECTIVE HIGHWAY ROAD
      // -----------------------------------------------------------
      const roadTopW = 70;
      const roadBottomW = 410;
      const cxTop = width / 2 + curveAngle;
      const cxBottom = width / 2;

      // Grass terrain
      ctx.fillStyle = "#0b151b";
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Road surface (Dark tarmac)
      ctx.beginPath();
      ctx.moveTo(cxTop - roadTopW / 2, horizonY);
      ctx.lineTo(cxTop + roadTopW / 2, horizonY);
      ctx.lineTo(cxBottom + roadBottomW / 2, height);
      ctx.lineTo(cxBottom - roadBottomW / 2, height);
      ctx.closePath();
      ctx.fillStyle = "#121827";
      ctx.fill();

      // Glowing Neon Curbs (Electric Blue)
      ctx.strokeStyle = nitroActive ? "#ec4899" : "#3b82f6";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cxTop - roadTopW / 2, horizonY);
      ctx.lineTo(cxBottom - roadBottomW / 2, height);
      ctx.moveTo(cxTop + roadTopW / 2, horizonY);
      ctx.lineTo(cxBottom + roadBottomW / 2, height);
      ctx.stroke();

      // Perspective Dashed Lane Dividers (3 LANES)
      for (let laneIdx = 1; laneIdx <= 2; laneIdx++) {
        const lanePct = laneIdx / 3;
        for (let seg = 0; seg < 14; seg++) {
          const zDepth = (seg * 50 + roadScroll * 1.5) % 650;
          const k = zDepth / 650;
          const py = horizonY + Math.pow(k, 1.8) * (height - horizonY);
          const pLen = 8 + Math.pow(k, 2) * 45;
          const currentRoadW = roadTopW + k * (roadBottomW - roadTopW);
          const curCenter = cxTop + k * (cxBottom - cxTop);
          const px = curCenter - currentRoadW / 2 + lanePct * currentRoadW;

          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1.5 + k * 3;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + pLen);
          ctx.stroke();
        }
      }

      // -----------------------------------------------------------
      // 3. ROADSIDE TREES & OVERHEAD GANTRIES
      // -----------------------------------------------------------
      // Palm Trees
      for (let p of palmTrees) {
        p.z -= currentSpeed * 0.12;
        if (p.z <= 10) p.z = 1000;

        const k = 1 - p.z / 1000;
        if (k > 0.05) {
          const py = horizonY + Math.pow(k, 1.8) * (height - horizonY);
          const currentRoadW = roadTopW + k * (roadBottomW - roadTopW);
          const curCenter = cxTop + k * (cxBottom - cxTop);
          const px = curCenter + p.side * (currentRoadW / 2 + 25 + k * 35);
          const treeH = 15 + k * 70;

          // Tree trunk
          ctx.strokeStyle = "rgba(120, 80, 50, " + (0.3 + k * 0.7) + ")";
          ctx.lineWidth = 1.5 + k * 3.5;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + p.side * 6 * k, py - treeH);
          ctx.stroke();

          // Palm Leaves (Green fronds)
          ctx.fillStyle = "rgba(16, 185, 129, " + (0.4 + k * 0.6) + ")";
          ctx.beginPath();
          ctx.arc(px + p.side * 6 * k, py - treeH, 6 + k * 18, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Overhead Gantries
      for (let g of gantries) {
        g.z -= currentSpeed * 0.12;
        if (g.z <= 10) g.z = 1800;

        const k = 1 - g.z / 1800;
        if (k > 0.25 && k < 0.95) {
          const py = horizonY + Math.pow(k, 1.8) * (height - horizonY);
          const currentRoadW = roadTopW + k * (roadBottomW - roadTopW);
          const curCenter = cxTop + k * (cxBottom - cxTop);
          const gantryH = 20 + k * 65;

          // Gantry Board
          ctx.fillStyle = "#064e3b";
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(curCenter - currentRoadW * 0.45, py - gantryH, currentRoadW * 0.9, 14 + k * 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold " + Math.round(7 + k * 7) + "px monospace";
          ctx.textAlign = "center";
          ctx.fillText(g.text, curCenter, py - gantryH + 11 + k * 10);
        }
      }

      // -----------------------------------------------------------
      // 4. ENTITIES: TRAFFIC AI & COLLECTIBLES (Pseudo-3D Projection)
      // -----------------------------------------------------------
      for (let i = entities.length - 1; i >= 0; i--) {
        const ent = entities[i];
        // Relative speed
        ent.z -= (currentSpeed - ent.speed) * 0.12;

        if (ent.z <= 0) {
          // Off screen behind player
          entities.splice(i, 1);
          continue;
        }

        const k = 1 - ent.z / 1000;
        if (k <= 0) continue;

        const py = horizonY + Math.pow(k, 1.8) * (height - horizonY);
        const currentRoadW = roadTopW + k * (roadBottomW - roadTopW);
        const curCenter = cxTop + k * (cxBottom - cxTop);
        const laneW = currentRoadW / 3;
        ent.x = curCenter + ent.lane * laneW;

        const scale = 0.25 + k * 0.95;

        ctx.save();
        ctx.translate(ent.x, py);
        ctx.scale(scale, scale);

        // --- DRAW SPECIFIC ENTITIES ---
        if (ent.type === "tuktuk") {
          // Sri Lankan Tuk-Tuk
          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.roundRect(-20, -32, 40, 48, 6);
          ctx.fill();

          // Black canvas roof
          ctx.fillStyle = "#1f2937";
          ctx.beginPath();
          ctx.roundRect(-18, -30, 36, 26, 4);
          ctx.fill();

          // Taillights
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(-17, 12, 6, 4);
          ctx.fillRect(11, 12, 6, 4);

          // Slogan Mud-flap
          ctx.fillStyle = "#000000";
          ctx.fillRect(-16, 17, 32, 8);
          ctx.fillStyle = "#facc15";
          ctx.font = "bold 5px monospace";
          ctx.textAlign = "center";
          ctx.fillText(ent.slogan || "MOM'S BLESSING", 0, 23);
        } else if (ent.type === "bus") {
          // CTB Ashok Leyland Red Express Bus
          ctx.fillStyle = "#dc2626";
          ctx.beginPath();
          ctx.roundRect(-28, -60, 56, 75, 6);
          ctx.fill();

          // Yellow roof
          ctx.fillStyle = "#facc15";
          ctx.fillRect(-26, -58, 52, 14);

          // Rear window
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(-22, -40, 44, 20);

          // Taillights
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(-24, 10, 8, 4);
          ctx.fillRect(16, 10, 8, 4);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 7px monospace";
          ctx.textAlign = "center";
          ctx.fillText("🚌 CTB EXPRESS", 0, -26);
        } else if (ent.type === "police") {
          // Police Interceptor with Flashing Strobe
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(-24, -36, 48, 52, 6);
          ctx.fill();
          ctx.fillStyle = "#1e3a8a";
          ctx.fillRect(-24, -20, 48, 14);

          // Flashing Beacon
          const flash = Math.floor(Date.now() / 150) % 2 === 0;
          ctx.fillStyle = flash ? "#ef4444" : "#3b82f6";
          ctx.beginPath();
          ctx.arc(0, -38, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (ent.type === "cone") {
          // Highway Roadworks Hazard
          ctx.fillStyle = "#f97316";
          ctx.beginPath();
          ctx.moveTo(0, -22);
          ctx.lineTo(-12, 10);
          ctx.lineTo(12, 10);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(-7, -4, 14, 4);
        } else if (ent.type === "fuel") {
          // 95-Octane Fuel Can
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.roundRect(-14, -16, 28, 30, 6);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⛽", 0, 4);
        } else if (ent.type === "coin") {
          // Golden Sri Lanka Rupee Coin Bundle
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("Rs", 0, 4);
        } else if (ent.type === "nitro") {
          // Nitro Turbo Boost Canister
          ctx.fillStyle = "#8b5cf6";
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⚡", 0, 5);
        } else if (ent.type === "shield") {
          // Energy Shield
          ctx.fillStyle = "#06b6d4";
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.font = "13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("🛡️", 0, 4);
        }
        ctx.restore();

        // --- COLLISION & NEAR-MISS DETECTION ---
        // Player is at playerY (approx 530), width ~52
        const playerActualX = width / 2 + playerX;
        const dx = Math.abs(playerActualX - ent.x);
        const dy = Math.abs(playerY - py);

        // Near-Miss Risk Multiplier Overtake
        if (ent.z < 120 && ent.z > 40 && !ent.passedPlayer) {
          if (dx > 38 && dx < 70 && dy < 35 && (ent.type === "tuktuk" || ent.type === "bus" || ent.type === "police")) {
            ent.passedPlayer = true;
            combo++;
            setNearMissCombo(combo);
            setNearMissBanner("RISKY OVERTAKE! +" + (250 * combo) + " PTS");
            soundFX.playNearMiss();
            setTimeout(() => setNearMissBanner(null), 1000);
          }
        }

        // Direct Hit
        if (dx < 36 && dy < 38) {
          if (ent.type === "fuel") {
            currentFuel = Math.min(100, currentFuel + 35);
            soundFX.playChime();
            entities.splice(i, 1);
          } else if (ent.type === "coin") {
            currentMoney += 75000;
            setMoneySaved(currentMoney);
            soundFX.playCoin();
            entities.splice(i, 1);
          } else if (ent.type === "nitro") {
            currentNitro = 100;
            soundFX.playTurboBlowoff(0.12);
            entities.splice(i, 1);
          } else if (ent.type === "shield") {
            shieldActive = true;
            setHasShield(true);
            soundFX.playChime();
            entities.splice(i, 1);
          } else if (ent.type === "cone" && selectedCar.id === "prado") {
            // Prado specialty: plows through cones!
            soundFX.playTireScreech();
            entities.splice(i, 1);
          } else {
            // Crash!
            if (shieldActive) {
              shieldActive = false;
              setHasShield(false);
              soundFX.playCrash();
              entities.splice(i, 1);
              cameraShake = 5;
            } else {
              soundFX.playCrash();
              endGame("Expressway Crash with " + (ent.type === "tuktuk" ? "Tuk-Tuk" : ent.type === "bus" ? "CTB Bus" : "Hazard"));
              return;
            }
          }
        }
      }

      // -----------------------------------------------------------
      // 5. DRAW PLAYER CAR (Detailed 3D Vector Car with Headlights & Nitro Flames)
      // -----------------------------------------------------------
      const pX = width / 2 + playerX;
      ctx.save();
      ctx.translate(pX, playerY);

      // Headlight beams illuminating road ahead
      const beamGrad = ctx.createLinearGradient(0, -25, 0, -180);
      beamGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      beamGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.12)");
      beamGrad.addColorStop(1, "transparent");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-20, -25);
      ctx.lineTo(-65, -180);
      ctx.lineTo(65, -180);
      ctx.lineTo(20, -25);
      ctx.closePath();
      ctx.fill();

      // Car Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.ellipse(0, 22, 28, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (hasShield || shieldActive) {
        ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nitro Flame Exhaust
      if (nitroActive) {
        const flameLen = 20 + Math.random() * 25;
        const flameGrad = ctx.createLinearGradient(0, 22, 0, 22 + flameLen);
        flameGrad.addColorStop(0, "#ffffff");
        flameGrad.addColorStop(0.3, "#38bdf8");
        flameGrad.addColorStop(1, "transparent");
        ctx.fillStyle = flameGrad;

        // Left flame
        ctx.beginPath();
        ctx.moveTo(-16, 22);
        ctx.lineTo(-12, 22 + flameLen);
        ctx.lineTo(-8, 22);
        ctx.fill();

        // Right flame
        ctx.beginPath();
        ctx.moveTo(8, 22);
        ctx.lineTo(12, 22 + flameLen);
        ctx.lineTo(16, 22);
        ctx.fill();
      }

      // Car Main Body
      ctx.fillStyle = selectedCar.color;
      ctx.beginPath();
      ctx.roundRect(-24, -30, 48, 54, 10);
      ctx.fill();

      // Roof / Cabin
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-19, -18, 38, 32, 6);
      ctx.fill();

      // Rear Windshield Glass
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(-16, -1, 32, 14, 4);
      ctx.fill();

      // Roof Top Accent
      ctx.fillStyle = selectedCar.accent;
      ctx.fillRect(-10, -14, 20, 6);

      // Glowing Red LED Taillight Strip
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(-21, 20, 42, 4, 2);
      ctx.fill();

      ctx.restore();

      // Motion speed lines on sides during Nitro
      if (nitroActive) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        for (let l = 0; l < 8; l++) {
          const ly = Math.random() * height;
          ctx.beginPath();
          ctx.moveTo(10, ly);
          ctx.lineTo(40, ly + 25);
          ctx.moveTo(width - 10, ly);
          ctx.lineTo(width - 40, ly + 25);
          ctx.stroke();
        }
      }

      ctx.restore(); // end shake

      animId = requestAnimationFrame(loop);
    };

    const endGame = (reason: string) => {
      soundFX.toggleSynthwaveBeat(false);
      setGameState("gameover");
      if (localScore > highScore) {
        setHighScore(localScore);
        try {
          localStorage.setItem("luxcar_highway_rush_highscore_v2", String(localScore));
        } catch (e) {}
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animId);
      soundFX.toggleSynthwaveBeat(false);
    };
  }, [isOpen, gameState, selectedCar, musicOn]);

  if (!isOpen) return null;

  const handleStartGame = (car: FleetVehicle) => {
    setSelectedCar(car);
    soundFX.playEngineRev();
    setScore(0);
    setDistanceKm(0);
    setSpeedKmh(car.baseSpeed);
    setFuel(100);
    setNitroGauge(100);
    setIsNitroActive(false);
    setHasShield(false);
    setMoneySaved(0);
    setNearMissCombo(0);
    setGameState("playing");
  };

  const handleToggleNitro = () => {
    if (nitroGauge > 20 && !isNitroActive && gameState === "playing") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#111827] to-[#0a0f1d] border-2 border-blue-500/40 shadow-2xl shadow-blue-500/30 overflow-hidden flex flex-col items-center">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏁</span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-2">
                <span>HIGHWAY RUSH: SRI LANKA E01</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white text-[9px] font-extrabold shadow-sm">
                  2.5D OUTRUN
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Southern Expressway • Dodge Tuk-Tuks & CTB Buses • Hit NITRO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Music Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !musicOn;
                setMusicOn(next);
                soundFX.toggleSynthwaveBeat(next && gameState === "playing");
              }}
              className={`p-1.5 rounded-xl border text-xs cursor-pointer ${
                musicOn ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "bg-white/5 border-white/10 text-slate-500"
              }`}
              title="Toggle Synthwave Arcade Beat"
            >
              <span>{musicOn ? "🎵" : "🔇"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Cockpit Telemetry HUD Bar during Gameplay */}
        {gameState === "playing" && (
          <div className="w-full grid grid-cols-5 gap-1.5 px-3 py-2 bg-[#0c1220] border-b border-white/10 text-center text-xs">
            <div>
              <div className="text-[9px] text-slate-400">SPEED</div>
              <div className="font-extrabold text-cyan-400 font-mono text-sm leading-none mt-0.5">
                {speedKmh} <span className="text-[8px]">KM/H</span>
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400">DISTANCE</div>
              <div className="font-extrabold text-white font-mono text-sm leading-none mt-0.5">
                {distanceKm} <span className="text-[8px]">KM</span>
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400">FUEL TANK</div>
              <div
                className={`font-extrabold font-mono text-sm leading-none mt-0.5 ${
                  fuel < 25 ? "text-red-400 animate-pulse" : "text-emerald-400"
                }`}
              >
                {fuel}%
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400">NITRO</div>
              <div
                className={`font-extrabold font-mono text-sm leading-none mt-0.5 ${
                  isNitroActive ? "text-pink-400 animate-pulse" : "text-purple-400"
                }`}
              >
                {nitroGauge}%
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400">SCORE</div>
              <div className="font-extrabold text-amber-400 font-mono text-sm leading-none mt-0.5">
                {score}
              </div>
            </div>
          </div>
        )}

        {/* Canvas & Interactive Layers */}
        <div className="relative w-full flex justify-center py-2 bg-black/70">
          <canvas
            ref={canvasRef}
            className="rounded-2xl border border-white/10 shadow-2xl max-w-full"
            style={{ width: 460, height: 500 }}
          />

          {/* Near-Miss Combo Floating Banner */}
          {nearMissBanner && (
            <div className="absolute top-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-black tracking-wider uppercase animate-bounce shadow-xl shadow-red-500/40">
              ⚡ {nearMissBanner}
            </div>
          )}

          {/* MENU: Vehicle Selection Modal Overlay */}
          {gameState === "menu" && (
            <div className="absolute inset-0 flex flex-col items-center justify-between p-5 bg-black/90 backdrop-blur-md text-center">
              <div>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl mb-2 shadow-xl shadow-blue-500/30">
                  🏎️
                </div>
                <h2 className="text-lg font-black text-white">Select Your Expressway Vehicle</h2>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Every vehicle handles with authentic physics and special Sri Lankan expressway perks!
                </p>
              </div>

              {/* 6 Selectable Cars Grid */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-md my-2">
                {FLEET_CARS.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => handleStartGame(car)}
                    className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-blue-400 text-left transition hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{car.icon}</span>
                      <span className="text-[9px] font-mono font-bold text-cyan-300">
                        Top {car.topSpeed} km/h
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-white group-hover:text-blue-300 truncate">
                      {car.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{car.subtitle}</div>
                    <div className="text-[9px] text-amber-300 font-semibold mt-1 truncate">
                      ★ {car.specialPerk}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <span>Steer with</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">◀ A</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">D ▶</span>
                <span>• Spacebar for</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-mono font-bold">
                  NITRO ⚡
                </span>
              </div>
            </div>
          )}

          {/* GAME OVER Overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-xl text-center animate-fade-in-up">
              <div className="text-4xl mb-2">💥</div>
              <h2 className="text-2xl font-black text-white mb-1">
                {fuel <= 0 ? "Fuel Tank Empty!" : "Expressway Crash!"}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                You drove {distanceKm} km on the Southern Expressway in the {selectedCar.name}!
              </p>

              <div className="grid grid-cols-2 gap-3 w-full max-w-xs p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-5">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Final Score</div>
                  <div className="text-xl font-black text-white font-mono">{score}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Money Saved</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    Rs. {moneySaved.toLocaleString()}
                  </div>
                </div>
              </div>

              {highScore > 0 && (
                <div className="text-xs text-amber-400 mb-4 font-bold flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>Personal Best: {highScore} pts</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleStartGame(selectedCar)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/30 transition cursor-pointer hover:scale-105 active:scale-95"
              >
                🔄 Play Again with {selectedCar.name}
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Touch Steering & Nitro Buttons (Active during gameplay) */}
        {gameState === "playing" && (
          <div className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0a0f1d] border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
              }}
              className="flex-1 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-blue-600 text-white font-bold text-xs border border-white/10 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>◀</span>
              <span>Left</span>
            </button>

            <button
              type="button"
              onClick={handleToggleNitro}
              className={`flex-1 py-3 rounded-2xl font-black text-xs border transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                isNitroActive
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-pink-500/30 animate-pulse"
                  : "bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border-purple-500/40"
              }`}
            >
              <span>⚡</span>
              <span>NITRO</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
              }}
              className="flex-1 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-blue-600 text-white font-bold text-xs border border-white/10 transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Right</span>
              <span>▶</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
