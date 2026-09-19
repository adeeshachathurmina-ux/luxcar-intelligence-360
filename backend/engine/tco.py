"""
LuxCar Intelligence 360 - 5-Year Total Cost of Ownership (TCO) Simulator
------------------------------------------------------------------------
Level: First-Year Undergraduate Computer Science / Software Engineering
Concept: Financial Arithmetic & Cost Estimation

Formula:
  Total Cost = (Purchase Price - Resale Value) + Total Fuel + Total Maintenance + Total Insurance

Clean, transparent, and easy to explain line-by-line during an academic presentation.
"""

from typing import Dict, Any, List, Optional


class OwnershipCostSimulator:
    """
    Simulates a straightforward 1-to-5 year ownership cost breakdown:
    - Fuel / Electricity expenses based on daily driving
    - Periodic routine maintenance
    - Annual vehicle insurance
    - Expected resale value recovery
    """

    # Fuel / Electricity Constants
    FUEL_PRICE_PETROL_LKR = 368.0   # Octane 92 / Liter in Sri Lanka
    FUEL_PRICE_DIESEL_LKR = 330.0   # Auto Diesel / Liter in Sri Lanka
    EV_UNIT_COST_LKR = 35.0         # CEB Electric Tariff / kWh

    # USD Fallback Constants
    FUEL_PRICE_PER_LITER_USD = 1.45

    def calculate_tco(
        self,
        vehicle: Dict[str, Any],
        holding_years: int = 5,
        annual_km: float = 15000,
        down_payment_pct: float = 0.20,
        loan_interest_apr: float = 0.125,
        loan_term_months: int = 60,
        custom_annual_insurance: Optional[float] = None,
        use_lkr: bool = True,
    ) -> Dict[str, Any]:
        """
        Calculates simple, realistic 5-year running costs.
        """
        if use_lkr:
            purchase_price = float(vehicle.get("base_price_lkr", float(vehicle.get("base_price_usd", 45000)) * 305.0))
            base_annual_maintenance = float(vehicle.get("annual_maintenance_lkr", 160000))
        else:
            purchase_price = float(vehicle.get("base_price_usd", 45000))
            base_annual_maintenance = float(vehicle.get("annual_maintenance_usd", 1200))

        fuel_consumption = float(vehicle.get("fuel_consumption_l100km", 6.5))
        fuel_type = str(vehicle.get("fuel_type", "Petrol")).lower()
        brand = str(vehicle.get("brand", "Toyota"))

        # 1. Annual Fuel / Energy Cost
        if use_lkr:
            if "electric" in fuel_type or "ev" in fuel_type:
                annual_fuel_cost = (annual_km / 100.0) * 16.0 * self.EV_UNIT_COST_LKR
            elif "diesel" in fuel_type:
                annual_fuel_cost = (annual_km / 100.0) * fuel_consumption * self.FUEL_PRICE_DIESEL_LKR
            else:
                annual_fuel_cost = (annual_km / 100.0) * fuel_consumption * self.FUEL_PRICE_PETROL_LKR
        else:
            if "electric" in fuel_type:
                annual_fuel_cost = (annual_km / 100.0) * 18.0 * 0.16
            else:
                annual_fuel_cost = (annual_km / 100.0) * fuel_consumption * self.FUEL_PRICE_PER_LITER_USD

        # 2. Annual Insurance (Standard 1.5% in SL)
        if custom_annual_insurance and custom_annual_insurance > 0:
            annual_insurance = custom_annual_insurance
        else:
            annual_insurance = round(purchase_price * 0.015, 2)

        # 3. Resale Retention Rate (e.g. Japanese cars hold 65-70%, European hold 55-60% after 5 years)
        if brand.lower() in ["toyota", "suzuki", "lexus"]:
            five_year_retention_rate = 0.70  # 70% value retained
        elif brand.lower() in ["honda", "byd", "nissan", "hyundai"]:
            five_year_retention_rate = 0.65  # 65% value retained
        else:
            five_year_retention_rate = 0.58  # 58% value retained for European luxury

        total_fuel = round(annual_fuel_cost * holding_years, 2)
        total_maintenance = round(base_annual_maintenance * holding_years, 2)
        total_insurance = round(annual_insurance * holding_years, 2)

        # Resale value after holding_years
        yearly_drop = (1.0 - five_year_retention_rate) / 5.0
        actual_retention = max(0.40, 1.0 - (yearly_drop * holding_years))
        final_resale = round(purchase_price * actual_retention, 2)
        total_depreciation = round(purchase_price - final_resale, 2)

        # Simple net total cost of ownership
        total_ownership_cost = round(
            total_depreciation + total_fuel + total_maintenance + total_insurance, 2
        )
        monthly_effective_cost = round(total_ownership_cost / (holding_years * 12), 2)

        # Build year-by-year progression timeline
        timeline = []
        for yr in range(1, holding_years + 1):
            yr_retention = 1.0 - (yearly_drop * yr)
            yr_resale = round(purchase_price * yr_retention, 2)
            yr_depreciation = round(purchase_price - yr_resale, 2)
            yr_fuel = round(annual_fuel_cost * yr, 2)
            yr_maint = round(base_annual_maintenance * yr, 2)
            yr_ins = round(annual_insurance * yr, 2)
            yr_net = round(yr_depreciation + yr_fuel + yr_maint + yr_ins, 2)

            timeline.append({
                "year": yr,
                "resale_value": yr_resale,
                "depreciation_loss": yr_depreciation,
                "fuel_cost": yr_fuel,
                "maintenance_cost": yr_maint,
                "insurance_cost": yr_ins,
                "loan_interest_cost": 0.0,
                "net_tco": yr_net,
            })

        return {
            "vehicle_id": vehicle["id"],
            "model_name": f"{vehicle['brand']} {vehicle['model']} ({vehicle['year']})",
            "purchase_price": purchase_price,
            "holding_period_years": holding_years,
            "annual_km": annual_km,
            "financing_details": {
                "down_payment_amount": round(purchase_price * down_payment_pct, 2),
                "principal_financed": round(purchase_price * (1.0 - down_payment_pct), 2),
                "monthly_loan_payment": 0.0,
                "total_interest_paid": 0.0,
                "loan_apr": round(loan_interest_apr * 100, 1),
            },
            "estimated_fuel_cost": total_fuel,
            "estimated_maintenance_cost": total_maintenance,
            "estimated_insurance_cost": total_insurance,
            "estimated_depreciation": total_depreciation,
            "estimated_resale_value": final_resale,
            "total_ownership_cost": total_ownership_cost,
            "monthly_effective_cost": monthly_effective_cost,
            "timeline": timeline,
            "disclaimer": "Includes fuel, preventative servicing, insurance, and estimated market resale value."
        }


tco_simulator = OwnershipCostSimulator()
