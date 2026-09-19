import os
import pandas as pd
from typing import List, Dict, Any, Optional

DATA_PATH = os.path.join(os.path.dirname(__file__), "vehicles.csv")

class VehicleRepository:
    def __init__(self, data_path: str = DATA_PATH):
        self.data_path = data_path
        self._load()

    def _load(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Vehicle dataset not found at {self.data_path}")
        self.df = pd.read_csv(self.data_path)

    def get_all(self) -> List[Dict[str, Any]]:
        return self.df.to_dict(orient="records")

    def get_by_id(self, vehicle_id: str) -> Optional[Dict[str, Any]]:
        match = self.df[self.df["id"] == vehicle_id]
        if match.empty:
            return None
        return match.iloc[0].to_dict()

    def filter_vehicles(
        self,
        brand: Optional[str] = None,
        body_type: Optional[str] = None,
        fuel_type: Optional[str] = None,
        max_price: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        filtered = self.df.copy()
        if brand and brand.lower() != "all":
            filtered = filtered[filtered["brand"].str.lower() == brand.lower()]
        if body_type and body_type.lower() != "all":
            filtered = filtered[filtered["body_type"].str.lower() == body_type.lower()]
        if fuel_type and fuel_type.lower() != "all":
            filtered = filtered[filtered["fuel_type"].str.lower() == fuel_type.lower()]
        if max_price:
            filtered = filtered[filtered["base_price_usd"] <= max_price]
        return filtered.to_dict(orient="records")

    def get_evolution(self, brand: str, model: str) -> List[Dict[str, Any]]:
        """Get generations of a specific model sorted chronologically by year."""
        matches = self.df[
            (self.df["brand"].str.lower() == brand.lower()) &
            (self.df["model"].str.lower() == model.lower())
        ].sort_values("year")
        return matches.to_dict(orient="records")

    def add_vehicle(self, vehicle_data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a newly discovered/imported vehicle to the catalogue."""
        new_row = pd.DataFrame([vehicle_data])
        self.df = pd.concat([self.df, new_row], ignore_index=True)
        self.df.to_csv(self.data_path, index=False)
        return vehicle_data

# Singleton instance
repo = VehicleRepository()
