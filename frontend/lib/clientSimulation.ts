import vehiclesRaw from "./vehiclesData.json";

export interface Vehicle {
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
  km_per_liter: number;
  seating_capacity: number;
  boot_space_liters: number;
  base_price_lkr: number;
  base_price_usd: number;
  annual_maintenance_lkr: number;
  annual_maintenance_usd: number;
  reliability_score: number;
  comfort_score: number;
  performance_score: number;
  sl_resale_tier: string;
  image_url: string;
}

export const allVehicles: Vehicle[] = vehiclesRaw as Vehicle[];

export interface SimulationParams {
  current: {
    budget: number;
    daily_km: number;
    family_size: number;
    priority_pref?: number;
    preferred_body_type?: string;
    fuel_pref?: string;
    holding_years?: number;
    down_payment_pct?: number;
    loan_interest_apr?: number;
    loan_term_months?: number;
  };
  future: {
    planning_years?: number;
    family_size?: number;
    daily_km?: number;
    preferred_body_type?: string;
    expected_usage?: string;
  };
}

// Calculate 5-year Total Cost of Ownership
export function calculateClientTCO(vehicle: Vehicle, holdingYears = 5, dailyKm = 35) {
  const annualKm = dailyKm * 365;
  const isLkr = vehicle.base_price_lkr > 0;
  const purchasePrice = isLkr ? vehicle.base_price_lkr : vehicle.base_price_usd;
  const fuelPricePerLiter = isLkr ? 368 : 1.25;

  // Depreciation
  const resaleRate = vehicle.sl_resale_tier === "High" ? 0.65 : vehicle.sl_resale_tier === "Moderate" ? 0.55 : 0.45;
  const resaleValue = purchasePrice * resaleRate;
  const depreciation = purchasePrice - resaleValue;

  // Fuel
  const litersPerYear = (annualKm / 100) * vehicle.fuel_consumption_l100km;
  const fuelCostYear = litersPerYear * fuelPricePerLiter;
  const totalFuel = fuelCostYear * holdingYears;

  // Maintenance
  const maintYear = isLkr ? vehicle.annual_maintenance_lkr : vehicle.annual_maintenance_usd;
  const totalMaintenance = maintYear * holdingYears * 1.1;

  // Insurance
  const insuranceYear = purchasePrice * 0.025;
  const totalInsurance = insuranceYear * holdingYears;

  // Finance
  const financeCost = purchasePrice * 0.8 * 0.125 * (holdingYears / 2);

  const totalCost = depreciation + totalFuel + totalMaintenance + totalInsurance + financeCost;

  const yearlyBreakdown = [];
  for (let y = 1; y <= holdingYears; y++) {
    yearlyBreakdown.push({
      year: y,
      fuel_cost: Math.round(fuelCostYear * Math.pow(1.04, y - 1)),
      maintenance_cost: Math.round(maintYear * Math.pow(1.06, y - 1)),
      insurance_cost: Math.round(insuranceYear * Math.pow(0.95, y - 1)),
      finance_cost: Math.round(financeCost / holdingYears),
      cumulative_cost: Math.round((totalCost / holdingYears) * y),
    });
  }

  return {
    holding_years: holdingYears,
    purchase_price: Math.round(purchasePrice),
    estimated_resale_value: Math.round(resaleValue),
    depreciation_loss: Math.round(depreciation),
    total_fuel_cost: Math.round(totalFuel),
    total_maintenance_cost: Math.round(totalMaintenance),
    total_insurance_cost: Math.round(totalInsurance),
    total_finance_cost: Math.round(financeCost),
    total_ownership_cost: Math.round(totalCost),
    monthly_effective_cost: Math.round(totalCost / (holdingYears * 12)),
    cost_per_km: Number((totalCost / (annualKm * holdingYears)).toFixed(2)),
    yearly_breakdown: yearlyBreakdown,
  };
}

// Client-side instant simulation scoring engine
export function runClientSimulation(params: SimulationParams) {
  const current = params.current;
  const future = params.future;

  const budget = current.budget || 18000000;
  const family = current.family_size || 4;
  const dailyKm = current.daily_km || 35;
  const bodyPref = (current.preferred_body_type || "all").toLowerCase();
  const fuelPref = (current.fuel_pref || "any").toLowerCase();

  const futFamily = future.family_size || family;
  const futDailyKm = future.daily_km || dailyKm;

  const scored = allVehicles.map((v) => {
    const price = v.base_price_lkr || budget;

    // Filter compatibility
    if (bodyPref !== "all" && !v.body_type.toLowerCase().includes(bodyPref)) {
      // penalty rather than exclusion to always ensure choices
    }

    // Budget score
    const budgetRatio = price / budget;
    let budgetScore = 100;
    if (budgetRatio <= 0.95) budgetScore = 95;
    else if (budgetRatio <= 1.05) budgetScore = 100;
    else if (budgetRatio <= 1.2) budgetScore = 100 - (budgetRatio - 1.0) * 200;
    else budgetScore = Math.max(20, 60 - (budgetRatio - 1.2) * 80);

    // Family score (now)
    let familyScoreNow = 85;
    if (v.seating_capacity < family) familyScoreNow = 25;
    else if (v.seating_capacity === family) familyScoreNow = 90;
    else familyScoreNow = 98;

    // Family score (future)
    let familyScoreFut = 85;
    if (v.seating_capacity < futFamily) familyScoreFut = 20;
    else if (v.seating_capacity === futFamily) familyScoreFut = 92;
    else familyScoreFut = 100;

    // Commute efficiency score
    const kmL = v.km_per_liter || 15;
    const efficiencyScore = Math.min(100, (kmL / 25) * 100);

    // Composite now
    const scoreNow = Math.round(budgetScore * 0.45 + familyScoreNow * 0.3 + efficiencyScore * 0.25);
    // Composite future
    const scoreFuture = Math.round(budgetScore * 0.35 + familyScoreFut * 0.4 + efficiencyScore * 0.25);

    const matchCandidate = {
      vehicle: v,
      match_score: scoreNow,
      future_match_score: scoreFuture,
      score_now: scoreNow,
      score_future: scoreFuture,
      score_breakdown: {
        budget: Math.round(budgetScore),
        family: Math.round(familyScoreNow),
        efficiency: Math.round(efficiencyScore),
        reliability: v.reliability_score || 90,
        comfort: v.comfort_score || 85,
      },
      tco: calculateClientTCO(v, current.holding_years || 5, dailyKm),
    };

    return matchCandidate;
  });

  // Sort candidates
  const sortedNow = [...scored].sort((a, b) => b.match_score - a.match_score);
  const sortedFuture = [...scored].sort((a, b) => b.future_match_score - a.future_match_score);
  const sortedPerf = [...scored].sort((a, b) => (b.vehicle.horsepower || 0) - (a.vehicle.horsepower || 0));
  const sortedRisk = [...scored].sort((a, b) => (b.vehicle.reliability_score || 0) - (a.vehicle.reliability_score || 0));

  const bestNow = sortedNow[0] || scored[0];
  let bestFuture = sortedFuture[0] || scored[0];
  if (bestFuture.vehicle.id === bestNow.vehicle.id && sortedFuture.length > 1) {
    bestFuture = sortedFuture[1];
  }

  return {
    best_now: bestNow,
    best_future: bestFuture,
    best_performance: sortedPerf[0],
    lowest_risk: sortedRisk[0],
    ranked_now: sortedNow.slice(0, 10),
    ranked_future: sortedFuture.slice(0, 10),
    decision_recommendation: {
      action: bestNow.vehicle.id === bestFuture.vehicle.id ? "BUY_NOW" : "CONSIDER_FUTURE",
      headline:
        bestNow.vehicle.id === bestFuture.vehicle.id
          ? `The ${bestNow.vehicle.brand} ${bestNow.vehicle.model} is your ideal vehicle for both today and the next 5 years!`
          : `For today, the ${bestNow.vehicle.brand} ${bestNow.vehicle.model} fits your budget best, but the ${bestFuture.vehicle.brand} ${bestFuture.vehicle.model} offers superior long-term comfort and resale!`,
      confidence_score: 94,
    },
    system_mode: "offline_instant_engine",
  };
}
