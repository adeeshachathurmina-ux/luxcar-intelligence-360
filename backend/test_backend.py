from data.loader import repo
from engine.scoring import scorer
from engine.tco import tco_simulator
from engine.clustering import clusterer

def run_tests():
    vehicles = repo.get_all()
    print(f"Loaded {len(vehicles)} vehicles (Expanded Sri Lankan Catalogue).")
    assert len(vehicles) >= 38, f"Expected 38+ vehicles, got {len(vehicles)}"

    # Test Sri Lankan LKR Simulation (e.g. Rs. 15,000,000 / 150 Lakhs budget)
    sl_current_req = {
        "budget": 15000000,
        "family_size": 4,
        "daily_km": 35,
        "priority_pref": 0.5,
        "preferred_body_type": "all",
        "fuel_pref": "any",
    }
    sl_future_req = {
        "planning_years": 3,
        "family_size": 5,
        "daily_km": 50,
        "preferred_body_type": "SUV",
        "expected_usage": "Family & Outstation Trips",
    }

    sim = scorer.run_simulation(vehicles, sl_current_req, sl_future_req)
    best_now = sim["best_now"]
    best_fut = sim["best_future"]
    print(f"\n[Sri Lanka LKR Simulation Passed]")
    print(f"  Best Now: {best_now['vehicle']['brand']} {best_now['vehicle']['model']} - Match: {best_now['current_score']['overall_match']}% (Price: Rs. {best_now['vehicle']['base_price_lkr']:,})")
    print(f"  Best Long-Term: {best_fut['vehicle']['brand']} {best_fut['vehicle']['model']} - Match: {best_fut['future_score']['overall_match']}%")

    # Test Sri Lankan TCO with Leasing APR & Fuel
    tco_lkr = tco_simulator.calculate_tco(
        best_now["vehicle"],
        holding_years=5,
        annual_km=15000,
        down_payment_pct=0.20,
        loan_interest_apr=0.125,
        use_lkr=True,
    )
    print(f"\n[Sri Lankan 5-Yr TCO Simulation Passed]")
    print(f"  Purchase Price: Rs. {tco_lkr['purchase_price']:,.0f}")
    print(f"  Financed: Rs. {tco_lkr['financing_details']['principal_financed']:,.0f} (Down: Rs. {tco_lkr['financing_details']['down_payment_amount']:,.0f})")
    print(f"  Total Ownership Cost: Rs. {tco_lkr['total_ownership_cost']:,.0f} (Monthly: Rs. {tco_lkr['monthly_effective_cost']:,.0f})")
    print(f"  Est. Resale Value: Rs. {tco_lkr['estimated_resale_value']:,.0f}")

    # Test 2nd-Year Data Science K-Means Clustering
    cluster_viz = clusterer.get_visualization_data(repo.df)
    assert len(cluster_viz["points"]) == len(vehicles), "All vehicles must be clustered"
    assert len(cluster_viz["centroids"]) == 4, "Must have 4 cluster centroids"
    print(f"\n[K-Means Clustering & 2D Projection Passed]")
    print(f"  Algorithm: {cluster_viz['model_metadata']['algorithm']}")
    print(f"  Silhouette Score: {cluster_viz['model_metadata']['silhouette_score']}")
    print(f"  Clusters found: {[c['label'] for c in cluster_viz['centroids']]}")

    print("\nALL SRI LANKAN BACKEND & DATA SCIENCE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
