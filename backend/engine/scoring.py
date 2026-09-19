"""
LuxCar Intelligence 360 - Vehicle Suitability Scoring Engine
-------------------------------------------------------------
Level: First-Year Undergraduate Computer Science / Software Engineering
Concept: Multi-Criteria Weighted Decision Matrix (MCDM)

This module calculates how well a vehicle matches a user's requirements:
1. Budget Match (40% weight): Does the vehicle price fit the user's budget?
2. Family Match (30% weight): Does the vehicle have enough seats and boot space?
3. Efficiency Match (30% weight): Is the fuel/power economy suitable for the daily travel distance?

Clean, transparent, and easy to explain during a university viva or presentation.
"""

from typing import Dict, Any, List, Optional


class SimulationScorer:
    """
    Computes explainable, easy-to-understand suitability scores (0 - 100%)
    for vehicles based on user budget, family size, and commute distance.
    """

    @staticmethod
    def calculate_budget_score(price: float, budget: float) -> float:
        """
        Calculates a 0-100 score based on how well the vehicle fits the budget.
        - Exactly on budget or slightly below = 95 - 100
        - Well within budget = 90 - 95
        - Slightly over budget = 60 - 80
        - Far over budget = below 40
        """
        if budget <= 0:
            return 80.0

        ratio = price / budget

        if ratio <= 0.90:
            # Under budget: Safe & affordable
            return 95.0
        elif ratio <= 1.05:
            # Perfectly aligned with budget
            return 100.0
        elif ratio <= 1.20:
            # 1% to 20% over budget: stretchable
            return max(50.0, 100.0 - (ratio - 1.0) * 200.0)
        elif ratio <= 1.50:
            # 20% to 50% over budget
            return max(20.0, 60.0 - (ratio - 1.2) * 120.0)
        else:
            # Over 50% above budget
            return 15.0

    @staticmethod
    def calculate_family_score(seating: int, boot_space: int, family_size: int, body_type: str) -> float:
        """
        Calculates a 0-100 score based on passenger capacity and boot space.
        - If seats < family size: Not enough seats (low score: 25)
        - If seats >= family size: Great fit (80-100 depending on boot space & body type)
        """
        # If the car cannot physically seat the family
        if seating < family_size:
            return 25.0

        score = 80.0

        # Extra seat comfort bonus
        if seating > family_size:
            score += 5.0

        # Boot space (luggage) bonus for families
        if family_size >= 4:
            if boot_space >= 550:
                score += 10.0
            elif boot_space < 400:
                score -= 10.0

        # Practicality bonus for SUV when family is 4 or more
        if family_size >= 4 and body_type.lower() == "suv":
            score += 5.0

        return max(20.0, min(100.0, score))

    @staticmethod
    def calculate_efficiency_score(fuel_type: str, fuel_consumption: float, daily_km: float) -> float:
        """
        Calculates a 0-100 score based on fuel economy and daily driving distance.
        - Higher daily distance demands better fuel economy (Hybrid / EV or low L/100km).
        """
        fuel_type = fuel_type.lower()
        score = 75.0

        # EVs and Hybrids receive efficiency bonuses
        if "electric" in fuel_type or "ev" in fuel_type:
            score = 95.0
        elif "hybrid" in fuel_type:
            score = 90.0
        else:
            # Petrol/Diesel: evaluate based on consumption (L/100km)
            # Consumption <= 6.0 is excellent, >= 12.0 is fuel heavy
            if fuel_consumption <= 6.5:
                score = 85.0
            elif fuel_consumption <= 9.0:
                score = 75.0
            elif fuel_consumption <= 12.0:
                score = 60.0
            else:
                score = 45.0

        # If user drives a lot daily (>50km), fuel-thirsty cars get penalized
        if daily_km >= 50 and score < 70.0:
            score -= 15.0

        return max(20.0, min(100.0, score))

    def evaluate_vehicle(
        self,
        vehicle: Dict[str, Any],
        budget: float,
        family_size: int,
        daily_km: float,
        preferred_body: str = "all",
        preferred_fuel: str = "any",
    ) -> Dict[str, Any]:
        """
        Evaluates a single vehicle and returns an overall percentage match (0-100%)
        along with component scores and plain-language explanation bullet points.
        """
        # Determine price based on budget currency (LKR if > 1 million, otherwise USD)
        is_lkr = budget > 1000000
        price = float(vehicle.get("base_price_lkr" if is_lkr else "base_price_usd", 45000))

        seating = int(vehicle.get("seating_capacity", 5))
        boot_space = int(vehicle.get("boot_space_liters", 480))
        body_type = str(vehicle.get("body_type", "Sedan"))
        fuel_type = str(vehicle.get("fuel_type", "Petrol"))
        fuel_consumption = float(vehicle.get("fuel_consumption_l100km", 7.0))
        reliability = float(vehicle.get("reliability_score", 85))

        # 1. Component scores
        budget_score = self.calculate_budget_score(price, budget)
        family_score = self.calculate_family_score(seating, boot_space, family_size, body_type)
        efficiency_score = self.calculate_efficiency_score(fuel_type, fuel_consumption, daily_km)

        # 2. Preferred type bonuses
        type_bonus = 0.0
        if preferred_body != "all" and preferred_body.lower() == body_type.lower():
            type_bonus += 5.0
        if preferred_fuel != "any" and preferred_fuel.lower() in fuel_type.lower():
            type_bonus += 5.0

        # 3. Weighted total score: Budget (40%), Family (30%), Efficiency (30%)
        overall = (
            (budget_score * 0.40) +
            (family_score * 0.30) +
            (efficiency_score * 0.30) +
            type_bonus
        )
        overall_match = max(10.0, min(99.0, round(overall, 1)))

        # 4. Plain-language bullet points explaining WHY this car fits
        reasons = []
        if price <= budget:
            diff = budget - price
            if is_lkr:
                reasons.append(f"Comfortably inside your budget (Saves Rs. {diff/1000000:.1f}M)")
            else:
                reasons.append(f"Comfortably inside your budget (Saves ${diff:,.0f})")
        else:
            reasons.append(f"Slightly above budget, but delivers high reliability & luxury value.")

        if seating >= family_size:
            reasons.append(f"{seating} comfortable seats easily fit your family of {family_size}.")
        else:
            reasons.append(f"Only {seating} seats — tighter fit for {family_size} people.")

        if "hybrid" in fuel_type.lower() or "electric" in fuel_type.lower():
            reasons.append(f"{fuel_type} engine delivers outstanding efficiency for daily {daily_km:.0f} km travel.")
        else:
            reasons.append(f"Responsive {vehicle.get('horsepower', 200)} HP engine with {fuel_consumption} L/100km.")

        return {
            "vehicle_id": vehicle["id"],
            "overall_match": overall_match,
            "budget_match": round(budget_score, 1),
            "family_match": round(family_score, 1),
            "efficiency_match": round(efficiency_score, 1),
            "comfort_match": round(float(vehicle.get("comfort_score", 85)), 1),
            "performance_match": round(float(vehicle.get("performance_score", 80)), 1),
            "reasons": reasons,
        }

    def run_simulation(
        self,
        vehicles: List[Dict[str, Any]],
        current_req: Dict[str, Any],
        future_req: Dict[str, Any],
        custom_weights: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """
        Ranks all vehicles according to user preferences and returns:
        - Best overall match
        - Future-proof alternative (accommodates growing family)
        - Top runner-up alternatives
        """
        cur_budget = float(current_req.get("budget", 15000000))
        cur_family = int(current_req.get("family_size", 4))
        cur_daily_km = float(current_req.get("daily_km", 35))
        cur_body = current_req.get("preferred_body_type", "all")
        cur_fuel = current_req.get("fuel_pref", "any")

        fut_family = int(future_req.get("family_size", cur_family + 1))
        fut_daily_km = float(future_req.get("daily_km", cur_daily_km + 15))
        fut_body = future_req.get("preferred_body_type", "SUV")
        planning_years = int(future_req.get("planning_years", 3))

        results = []

        for v in vehicles:
            cur_eval = self.evaluate_vehicle(
                v, cur_budget, cur_family, cur_daily_km, cur_body, cur_fuel
            )
            # Future scenario (allows slight budget growth over 3 years)
            fut_budget = cur_budget * 1.15
            fut_eval = self.evaluate_vehicle(
                v, fut_budget, fut_family, fut_daily_km, fut_body, cur_fuel
            )

            results.append({
                "vehicle": v,
                "current_score": cur_eval,
                "future_score": fut_eval,
                "future_delta": round(fut_eval["overall_match"] - cur_eval["overall_match"], 1),
            })

        # Sort candidates by current score
        sorted_by_current = sorted(results, key=lambda x: x["current_score"]["overall_match"], reverse=True)
        sorted_by_future = sorted(results, key=lambda x: x["future_score"]["overall_match"], reverse=True)
        sorted_by_perf = sorted(results, key=lambda x: x["vehicle"]["performance_score"], reverse=True)
        sorted_by_risk = sorted(results, key=lambda x: x["vehicle"]["reliability_score"], reverse=True)

        best_now = sorted_by_current[0]
        best_future = sorted_by_future[0]
        best_perf = sorted_by_perf[0]
        lowest_risk = sorted_by_risk[0]

        # Simple, clear decision text
        now_name = f"{best_now['vehicle']['brand']} {best_now['vehicle']['model']}"
        fut_name = f"{best_future['vehicle']['brand']} {best_future['vehicle']['model']}"
        
        reasons = [
            f"{now_name} is your top overall choice with a {best_now['current_score']['overall_match']}% suitability score.",
            f"It fits your {cur_family}-member family and daily {cur_daily_km:.0f} km commute.",
        ]
        if best_now["vehicle"]["id"] != best_future["vehicle"]["id"]:
            reasons.append(f"In {planning_years} years as needs expand, consider the {fut_name} for extra space.")
        else:
            reasons.append(f"This car remains a great match even after {planning_years} years!")

        decision_support = {
            "verdict": "Great Match Found!" if best_now["current_score"]["overall_match"] >= 80 else "Good Match Available",
            "compatibility_level": "High Match" if best_now["current_score"]["overall_match"] >= 85 else "Moderate Match",
            "reasons": reasons,
            "recommended_timing": f"Recommended for the next {planning_years} to 5 years",
        }

        return {
            "best_now": best_now,
            "best_future": best_future,
            "best_performance": best_perf,
            "lowest_risk": lowest_risk,
            "all_ranked": sorted_by_current[:6],
            "decision_support": decision_support,
            "scenario_metadata": {
                "planning_years": planning_years,
                "current_family": cur_family,
                "future_family": fut_family,
                "current_daily_km": cur_daily_km,
                "future_daily_km": fut_daily_km,
            },
        }


scorer = SimulationScorer()
