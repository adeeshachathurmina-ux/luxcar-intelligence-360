from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from data.loader import repo
from engine.scoring import scorer
from engine.tco import tco_simulator

router = APIRouter(prefix="/api/simulate", tags=["Simulator"])

class CurrentRequirements(BaseModel):
    budget: float = Field(default=15000000, description="Available purchase budget (LKR or USD)")
    daily_km: float = Field(default=30, description="Current daily travel distance in km")
    family_size: int = Field(default=4, description="Family passenger capacity requirement")
    priority_pref: float = Field(default=0.5, description="Preference weight (0.0=Comfort, 1.0=Performance)")
    preferred_body_type: str = Field(default="all", description="Sedan, SUV, Hatchback, or all")
    fuel_pref: str = Field(default="any", description="Petrol, Hybrid, Electric, Diesel, or any")
    holding_years: int = Field(default=5, description="Ownership duration in years")
    down_payment_pct: float = Field(default=0.20, description="Down payment ratio")
    loan_interest_apr: float = Field(default=0.125, description="Annual leasing APR")
    loan_term_months: int = Field(default=60, description="Loan term in months")
    custom_annual_insurance: Optional[float] = Field(default=None, description="Insurance estimate")

class FutureRequirements(BaseModel):
    planning_years: int = Field(default=3, description="Future simulation horizon in years")
    family_size: int = Field(default=5, description="Expected family size in future")
    daily_km: float = Field(default=45, description="Expected daily travel distance in km")
    preferred_body_type: str = Field(default="SUV", description="Expected body type preference")
    expected_usage: str = Field(default="Family and Trips", description="Usage lifestyle description")

class SimulationRequest(BaseModel):
    current: CurrentRequirements
    future: FutureRequirements
    custom_weights: Optional[Dict[str, float]] = Field(default=None, description="Custom weights")

@router.post("")
def simulate(req: SimulationRequest):
    vehicles = repo.get_all()
    if not vehicles:
        raise HTTPException(status_code=500, detail="Vehicle catalogue is empty")

    sim_result = scorer.run_simulation(
        vehicles=vehicles,
        current_req=req.current.model_dump(),
        future_req=req.future.model_dump(),
        custom_weights=req.custom_weights,
    )

    use_lkr = req.current.budget > 1000000

    # Attach simple 5-year ownership costs for top candidates
    for key in ["best_now", "best_future", "best_performance", "lowest_risk"]:
        candidate = sim_result[key]
        annual_km = req.current.daily_km * 365
        candidate["tco"] = tco_simulator.calculate_tco(
            candidate["vehicle"],
            holding_years=req.current.holding_years,
            annual_km=annual_km,
            down_payment_pct=req.current.down_payment_pct,
            loan_interest_apr=req.current.loan_interest_apr,
            loan_term_months=req.current.loan_term_months,
            custom_annual_insurance=req.current.custom_annual_insurance,
            use_lkr=use_lkr,
        )

    return sim_result

@router.get("/tco/{vehicle_id}")
def get_vehicle_tco(
    vehicle_id: str,
    years: int = 5,
    annual_km: float = 15000,
    use_lkr: bool = True,
):
    v = repo.get_by_id(vehicle_id)
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return tco_simulator.calculate_tco(
        v,
        holding_years=years,
        annual_km=annual_km,
        use_lkr=use_lkr,
    )
