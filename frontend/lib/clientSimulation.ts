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
    custom_annual_insurance?: number;
  };
  future: {
    planning_years?: number;
    family_size?: number;
    daily_km?: number;
    preferred_body_type?: string;
    expected_usage?: string;
  };
}

export interface TCOTimelineItem {
  year: number;
  resale_value: number;
  depreciation_loss: number;
  fuel_cost: number;
  maintenance_cost: number;
  insurance_cost: number;
  loan_interest_cost: number;
  net_tco: number;
}

export interface TCOData {
  vehicle_id: string;
  model_name: string;
  purchase_price: number;
  holding_period_years: number;
  annual_km: number;
  financing_details: {
    down_payment_amount: number;
    principal_financed: number;
    monthly_loan_payment: number;
    total_interest_paid: number;
    loan_apr: number;
  };
  estimated_fuel_cost: number;
  estimated_maintenance_cost: number;
  estimated_insurance_cost: number;
  estimated_depreciation: number;
  estimated_resale_value: number;
  total_ownership_cost: number;
  monthly_effective_cost: number;
  timeline: TCOTimelineItem[];
  disclaimer?: string;
  depreciation_loss?: number;
  total_fuel_cost?: number;
  total_maintenance_cost?: number;
  total_insurance_cost?: number;
  total_finance_cost?: number;
}

export interface CandidateScore {
  vehicle_id: string;
  overall_match: number;
  budget_match: number;
  family_match: number;
  efficiency_match: number;
  comfort_match: number;
  performance_match: number;
  reasons: string[];
}

export interface MatchCandidate {
  vehicle: Vehicle;
  current_score: CandidateScore;
  future_score: CandidateScore;
  future_delta: number;
  tco: TCOData;
  match_score: number;
  future_match_score: number;
  score_now: number;
  score_future: number;
  score_breakdown: {
    budget: number;
    family: number;
    efficiency: number;
    reliability: number;
    comfort: number;
  };
}

export interface DecisionSupport {
  verdict: string;
  compatibility_level: string;
  reasons: string[];
  recommended_timing: string;
}

export interface SimulationResult {
  best_now: MatchCandidate;
  best_future: MatchCandidate;
  best_performance: MatchCandidate;
  lowest_risk: MatchCandidate;
  all_ranked: MatchCandidate[];
  decision_support: DecisionSupport;
  scenario_metadata: {
    planning_years: number;
    current_family: number;
    future_family: number;
    current_daily_km: number;
    future_daily_km: number;
  };
  system_mode?: string;
}

// 5-Year Total Cost of Ownership calculation
export function calculateClientTCO(vehicle: Vehicle, holdingYears = 5, dailyKm = 35): TCOData {
  const annualKm = dailyKm * 365;
  const isLkr = vehicle.base_price_lkr > 0;
  const purchasePrice = isLkr ? vehicle.base_price_lkr : vehicle.base_price_usd * 305;
  const fuelPricePerLiter = isLkr ? 368 : 1.45;
  const brand = (vehicle.brand || "Toyota").toLowerCase();

  // Retention rates matching backend
  let fiveYearRetention = 0.58;
  if (["toyota", "suzuki", "lexus"].includes(brand)) {
    fiveYearRetention = 0.70;
  } else if (["honda", "byd", "nissan", "hyundai"].includes(brand)) {
    fiveYearRetention = 0.65;
  }

  const yearlyDrop = (1.0 - fiveYearRetention) / 5.0;
  const actualRetention = Math.max(0.40, 1.0 - yearlyDrop * holdingYears);
  const finalResale = Math.round(purchasePrice * actualRetention);
  const totalDepreciation = Math.round(purchasePrice - finalResale);

  // Fuel calculation
  const fuelConsumption = vehicle.fuel_consumption_l100km || 6.5;
  const fuelType = (vehicle.fuel_type || "Petrol").toLowerCase();
  let annualFuel = 0;
  if (fuelType.includes("electric") || fuelType.includes("ev")) {
    annualFuel = (annualKm / 100) * 16.0 * (isLkr ? 35 : 0.16);
  } else if (fuelType.includes("diesel")) {
    annualFuel = (annualKm / 100) * fuelConsumption * (isLkr ? 330 : 1.35);
  } else {
    annualFuel = (annualKm / 100) * fuelConsumption * fuelPricePerLiter;
  }
  const totalFuel = Math.round(annualFuel * holdingYears);

  // Maintenance
  const annualMaint = isLkr
    ? vehicle.annual_maintenance_lkr || 150000
    : (vehicle.annual_maintenance_usd || 500) * 305;
  const totalMaint = Math.round(annualMaint * holdingYears);

  // Insurance (1.5% in SL)
  const annualInsurance = Math.round(purchasePrice * 0.015);
  const totalInsurance = Math.round(annualInsurance * holdingYears);

  const totalCost = Math.round(totalDepreciation + totalFuel + totalMaint + totalInsurance);
  const monthlyEffective = Math.round(totalCost / (holdingYears * 12));

  const timeline: TCOTimelineItem[] = [];
  for (let yr = 1; yr <= holdingYears; yr++) {
    const yrRetention = 1.0 - yearlyDrop * yr;
    const yrResale = Math.round(purchasePrice * yrRetention);
    const yrDeprec = Math.round(purchasePrice - yrResale);
    const yrFuel = Math.round(annualFuel * yr);
    const yrMaint = Math.round(annualMaint * yr);
    const yrIns = Math.round(annualInsurance * yr);
    const yrNet = yrDeprec + yrFuel + yrMaint + yrIns;

    timeline.push({
      year: yr,
      resale_value: yrResale,
      depreciation_loss: yrDeprec,
      fuel_cost: yrFuel,
      maintenance_cost: yrMaint,
      insurance_cost: yrIns,
      loan_interest_cost: 0,
      net_tco: yrNet,
    });
  }

  return {
    vehicle_id: vehicle.id,
    model_name: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
    purchase_price: Math.round(purchasePrice),
    holding_period_years: holdingYears,
    annual_km: Math.round(annualKm),
    financing_details: {
      down_payment_amount: Math.round(purchasePrice * 0.2),
      principal_financed: Math.round(purchasePrice * 0.8),
      monthly_loan_payment: 0,
      total_interest_paid: 0,
      loan_apr: 12.5,
    },
    estimated_fuel_cost: totalFuel,
    estimated_maintenance_cost: totalMaint,
    estimated_insurance_cost: totalInsurance,
    estimated_depreciation: totalDepreciation,
    estimated_resale_value: finalResale,
    total_ownership_cost: totalCost,
    monthly_effective_cost: monthlyEffective,
    timeline,
    disclaimer: "Includes fuel, preventative servicing, insurance, and estimated market resale value.",
    depreciation_loss: totalDepreciation,
    total_fuel_cost: totalFuel,
    total_maintenance_cost: totalMaint,
    total_insurance_cost: totalInsurance,
    total_finance_cost: 0,
  };
}

function evaluateVehicle(
  vehicle: Vehicle,
  budget: number,
  familySize: number,
  dailyKm: number,
  bodyTypePref: string = "all",
  fuelPref: string = "any"
): CandidateScore {
  const isLkr = vehicle.base_price_lkr > 0;
  const price = isLkr ? vehicle.base_price_lkr : vehicle.base_price_usd * 305;
  const seating = vehicle.seating_capacity || 5;
  const fuelType = vehicle.fuel_type || "Petrol";
  const fuelConsumption = vehicle.fuel_consumption_l100km || 6.5;

  // 1. Budget Score (0-100)
  let budgetScore = 50.0;
  if (price <= budget) {
    const ratio = price / Math.max(budget, 1);
    budgetScore = 80.0 + (1.0 - ratio) * 20.0;
  } else {
    const overPct = (price - budget) / Math.max(budget, 1);
    budgetScore = Math.max(20.0, 80.0 - overPct * 150.0);
  }

  // 2. Family Seating Score (0-100)
  let familyScore = 50.0;
  if (seating >= familySize) {
    familyScore = 95.0;
    if (seating > familySize + 2) familyScore = 88.0;
  } else {
    const deficit = familySize - seating;
    familyScore = Math.max(15.0, 75.0 - deficit * 30.0);
  }

  // 3. Efficiency Score (0-100)
  let efficiencyScore = 60.0;
  if (fuelConsumption <= 4.5) efficiencyScore = 98.0;
  else if (fuelConsumption <= 6.0) efficiencyScore = 90.0;
  else if (fuelConsumption <= 8.0) efficiencyScore = 78.0;
  else if (fuelConsumption <= 11.0) efficiencyScore = 65.0;
  else efficiencyScore = 45.0;

  let typeBonus = 0.0;
  if (bodyTypePref !== "all" && vehicle.body_type?.toLowerCase().includes(bodyTypePref.toLowerCase())) {
    typeBonus += 5.0;
  }
  if (fuelPref !== "any" && fuelType.toLowerCase().includes(fuelPref.toLowerCase())) {
    typeBonus += 5.0;
  }

  const overall = Math.max(
    10.0,
    Math.min(
      99.0,
      Math.round(budgetScore * 0.4 + familyScore * 0.3 + efficiencyScore * 0.3 + typeBonus)
    )
  );

  const reasons: string[] = [];
  if (price <= budget) {
    const diff = budget - price;
    reasons.push(`Comfortably inside your budget (Saves Rs. ${(diff / 1000000).toFixed(1)}M)`);
  } else {
    reasons.push("Slightly above budget, but delivers high reliability & luxury value.");
  }

  if (seating >= familySize) {
    reasons.push(`${seating} comfortable seats easily fit your family of ${familySize}.`);
  } else {
    reasons.push(`Only ${seating} seats — tighter fit for ${familySize} people.`);
  }

  if (fuelType.toLowerCase().includes("hybrid") || fuelType.toLowerCase().includes("electric")) {
    reasons.push(`${fuelType} engine delivers outstanding efficiency for daily ${dailyKm} km travel.`);
  } else {
    reasons.push(`Responsive ${vehicle.horsepower} HP engine with ${fuelConsumption} L/100km.`);
  }

  return {
    vehicle_id: vehicle.id,
    overall_match: overall,
    budget_match: Math.round(budgetScore),
    family_match: Math.round(familyScore),
    efficiency_match: Math.round(efficiencyScore),
    comfort_match: vehicle.comfort_score || 85,
    performance_match: vehicle.performance_score || 80,
    reasons,
  };
}

export function runClientSimulation(params: SimulationParams): SimulationResult {
  const current = params.current;
  const future = params.future;

  const budget = current.budget || 18000000;
  const family = current.family_size || 4;
  const dailyKm = current.daily_km || 35;
  const bodyPref = (current.preferred_body_type || "all").toLowerCase();
  const fuelPref = (current.fuel_pref || "any").toLowerCase();

  const futFamily = future.family_size || family;
  const futDailyKm = future.daily_km || dailyKm;
  const planningYears = future.planning_years || 3;

  const scored: MatchCandidate[] = allVehicles.map((v) => {
    const curEval = evaluateVehicle(v, budget, family, dailyKm, bodyPref, fuelPref);
    const futBudget = budget * 1.15;
    const futEval = evaluateVehicle(v, futBudget, futFamily, futDailyKm, "SUV", fuelPref);
    const candidateTco = calculateClientTCO(v, current.holding_years || 5, dailyKm);

    return {
      vehicle: v,
      current_score: curEval,
      future_score: futEval,
      future_delta: Number((futEval.overall_match - curEval.overall_match).toFixed(1)),
      tco: candidateTco,
      match_score: curEval.overall_match,
      future_match_score: futEval.overall_match,
      score_now: curEval.overall_match,
      score_future: futEval.overall_match,
      score_breakdown: {
        budget: curEval.budget_match,
        family: curEval.family_match,
        efficiency: curEval.efficiency_match,
        reliability: v.reliability_score || 90,
        comfort: curEval.comfort_match,
      },
    };
  });

  const sortedNow = [...scored].sort((a, b) => b.current_score.overall_match - a.current_score.overall_match);
  const sortedFuture = [...scored].sort((a, b) => b.future_score.overall_match - a.future_score.overall_match);
  const sortedPerf = [...scored].sort((a, b) => (b.vehicle.performance_score || 0) - (a.vehicle.performance_score || 0));
  const sortedRisk = [...scored].sort((a, b) => (b.vehicle.reliability_score || 0) - (a.vehicle.reliability_score || 0));

  const bestNow = sortedNow[0] || scored[0];
  let bestFuture = sortedFuture[0] || scored[0];
  if (bestFuture.vehicle.id === bestNow.vehicle.id && sortedFuture.length > 1) {
    bestFuture = sortedFuture[1];
  }
  const bestPerf = sortedPerf[0] || scored[0];
  const lowestRisk = sortedRisk[0] || scored[0];

  const nowName = `${bestNow.vehicle.brand} ${bestNow.vehicle.model}`;
  const futName = `${bestFuture.vehicle.brand} ${bestFuture.vehicle.model}`;

  const decisionReasons = [
    `${nowName} is your top overall choice with a ${bestNow.current_score.overall_match}% suitability score.`,
    `It fits your ${family}-member family and daily ${dailyKm} km commute.`,
  ];
  if (bestNow.vehicle.id !== bestFuture.vehicle.id) {
    decisionReasons.push(`In ${planningYears} years as needs expand, consider the ${futName} for extra space.`);
  } else {
    decisionReasons.push(`This car remains a great match even after ${planningYears} to 5 years!`);
  }

  const decisionSupport: DecisionSupport = {
    verdict: bestNow.current_score.overall_match >= 80 ? "Great Match Found!" : "Good Match Available",
    compatibility_level: bestNow.current_score.overall_match >= 85 ? "High Match" : "Moderate Match",
    reasons: decisionReasons,
    recommended_timing: `Recommended for the next ${planningYears} to 5 years`,
  };

  return {
    best_now: bestNow,
    best_future: bestFuture,
    best_performance: bestPerf,
    lowest_risk: lowestRisk,
    all_ranked: sortedNow.slice(0, 6),
    decision_support: decisionSupport,
    scenario_metadata: {
      planning_years: planningYears,
      current_family: family,
      future_family: futFamily,
      current_daily_km: dailyKm,
      future_daily_km: futDailyKm,
    },
    system_mode: "offline_instant_engine",
  };
}
