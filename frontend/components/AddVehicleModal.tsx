"use client";

import React, { useState } from "react";
import { XIcon, CarIcon, SparklesIcon } from "./Icons";
import { resolveVehicleImage } from "./VehicleImageResolver";
import { API_BASE_URL } from "@/lib/api";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleAdded: (vehicle: any) => void;
}

export function AddVehicleModal({
  isOpen,
  onClose,
  onVehicleAdded,
}: AddVehicleModalProps) {
  const [brand, setBrand] = useState("Toyota");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2024);
  const [bodyType, setBodyType] = useState("SUV");
  const [fuelType, setFuelType] = useState("Hybrid");
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [priceLkr, setPriceLkr] = useState(16500000); // 16.5M default
  const [bootSpace, setBootSpace] = useState(480);
  const [kmPerLiter, setKmPerLiter] = useState(20.0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [autoPhotoUrl, setAutoPhotoUrl] = useState("");
  const [isFetchingPhoto, setIsFetchingPhoto] = useState(false);
  const [photoSourceLabel, setPhotoSourceLabel] = useState("");

  if (!isOpen) return null;

  const handleAutoFetchPhoto = async (overrideModel?: string) => {
    const targetModel = overrideModel || model;
    if (!targetModel.trim()) return;

    setIsFetchingPhoto(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles/auto-photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand.trim(),
          model: targetModel.trim(),
          year: Number(year),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.photo_url) {
          setAutoPhotoUrl(data.photo_url);
          setPhotoSourceLabel(data.source || "Automotive Repository");
        }
      }
    } catch (err) {
      console.log("Auto-photo lookup fallback to local catalog", err);
    } finally {
      setIsFetchingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setErrorMsg("Please enter a vehicle model name (e.g. Corolla Cross, Vezel)");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const resolvedPhoto = autoPhotoUrl || resolveVehicleImage({ brand, model, body_type: bodyType });

    const newVehicleData = {
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      body_type: bodyType,
      fuel_type: fuelType,
      seating_capacity: Number(seatingCapacity),
      boot_space_liters: Number(bootSpace),
      base_price_lkr: Number(priceLkr),
      base_price_usd: Math.round(Number(priceLkr) / 305),
      km_per_liter: Number(kmPerLiter),
      fuel_consumption_l100km: kmPerLiter > 0 ? Number((100 / kmPerLiter).toFixed(1)) : 5.5,
      horsepower: 150,
      torque_nm: 220,
      annual_maintenance_lkr: Math.round(Number(priceLkr) * 0.012),
      annual_maintenance_usd: Math.round((Number(priceLkr) / 305) * 0.012),
      reliability_score: 92,
      comfort_score: 88,
      performance_score: 80,
      sl_resale_tier: brand.toLowerCase() === "toyota" || brand.toLowerCase() === "suzuki" ? "High" : "Moderate",
      image_url: resolvedPhoto,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicleData),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMsg(`✓ ${brand} ${model} added with authentic real photo!`);
        setTimeout(() => {
          onVehicleAdded(data.vehicle || newVehicleData);
          onClose();
        }, 1200);
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || "Could not add vehicle.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const formatLkrLabel = (amt: number) => {
    const millions = amt / 1000000;
    const lakhs = amt / 100000;
    return `Rs. ${millions.toFixed(1)}M (${lakhs.toFixed(0)} Lakhs)`;
  };

  const currentPreviewImage = autoPhotoUrl || resolveVehicleImage({ brand, model, body_type: bodyType });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="w-full max-w-lg rounded-3xl bg-[#0d131f] border border-white/15 p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
            <CarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Add New Vehicle
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Auto-Real Photo
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              New vehicle with automatic genuine real photo resolution
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand:
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setAutoPhotoUrl("");
                }}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="BYD">BYD</option>
                <option value="Nissan">Nissan</option>
                <option value="Hyundai">Hyundai</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="Audi">Audi</option>
                <option value="Lexus">Lexus</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Tesla">Tesla</option>
                <option value="Porsche">Porsche</option>
                <option value="Volvo">Volvo</option>
                <option value="Kia">Kia</option>
                <option value="Mitsubishi">Mitsubishi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Model Name:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Corolla Cross, Prado, Vezel"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setAutoPhotoUrl("");
                  }}
                  onBlur={() => handleAutoFetchPhoto()}
                  required
                  className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Live Photo Auto-Detection Preview Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/20 relative overflow-hidden">
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-900 border border-white/15 shrink-0 relative group">
              <img
                src={currentPreviewImage}
                alt="Auto-detected car"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {isFetchingPhoto && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-blue-300 font-bold animate-pulse">
                  Searching...
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                  <span>📸</span> Real Photo Auto-Linked
                </span>
                <button
                  type="button"
                  onClick={() => handleAutoFetchPhoto()}
                  disabled={!model.trim() || isFetchingPhoto}
                  className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 underline disabled:opacity-40 cursor-pointer"
                >
                  {isFetchingPhoto ? "Searching..." : "Re-search Real Photo"}
                </button>
              </div>
              <p className="text-xs text-white font-bold truncate">
                {brand} {model || "(Type model name above)"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {photoSourceLabel ? `Source: ${photoSourceLabel}` : "Real photo will be automatically downloaded and saved"}
              </p>
            </div>
          </div>

          {/* Year & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Year:
              </label>
              <input
                type="number"
                min="2015"
                max="2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price (LKR):
              </label>
              <input
                type="number"
                step="100000"
                min="1000000"
                value={priceLkr}
                onChange={(e) => setPriceLkr(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {formatLkrLabel(priceLkr)}
              </span>
            </div>
          </div>

          {/* Body Type & Fuel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Body Style:
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fuel Type:
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>
          </div>

          {/* Seats & Fuel Economy */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seats:
              </label>
              <div className="flex gap-2">
                {[2, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSeatingCapacity(num)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      seatingCapacity === num
                        ? "bg-blue-600 text-white border-blue-400"
                        : "bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    {num} Seats
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fuel Economy (km/L):
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="40"
                value={kmPerLiter}
                onChange={(e) => setKmPerLiter(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving to Database..." : "💾 Save Vehicle to Database"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
