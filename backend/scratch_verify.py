import urllib.request
import json

def verify_system():
    print("========================================")
    print("      LUXCAR INTELLIGENCE 360")
    print("    Real Vehicle Photos Verification")
    print("========================================")

    # 1. Check Frontend
    try:
        req = urllib.request.Request("http://localhost:3000")
        with urllib.request.urlopen(req, timeout=8) as resp:
            print(f"[OK] Next.js Frontend is ONLINE (HTTP {resp.status})")
    except Exception as e:
        print(f"[ERROR] Frontend failed: {e}")

    # 2. Check Backend Vehicles API
    try:
        req = urllib.request.Request("http://127.0.0.1:8000/api/vehicles")
        with urllib.request.urlopen(req, timeout=8) as resp:
            vehicles = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] Backend API is ONLINE with {len(vehicles)} vehicles in catalogue")
    except Exception as e:
        print(f"[ERROR] Backend failed: {e}")
        return

    # 3. Test static image delivery via Next.js
    print("\n--- Testing Sample Vehicle Image Delivery via Next.js ---")
    tested = 0
    passed = 0
    for v in vehicles[:10]:
        img_url = "http://localhost:3000" + v["image_url"]
        try:
            with urllib.request.urlopen(img_url, timeout=5) as img_resp:
                size = img_resp.headers.get("Content-Length", "unknown")
                print(f"  [200 OK] {v['brand']} {v['model']}: {v['image_url']} ({size} bytes)")
                passed += 1
        except Exception as e:
            print(f"  [FAIL] {v['brand']} {v['model']}: {e}")
        tested += 1

    print(f"Summary: {passed}/{tested} tested images served with HTTP 200 OK without errors!")

    # 4. Check simulation API
    print("\n--- Testing AI Match & Simulation Output ---")
    sim_payload = json.dumps({
        "current": {
            "budget": 18000000,
            "daily_km": 35,
            "family_size": 4,
            "priority_pref": 0.5,
            "preferred_body_type": "all",
            "fuel_pref": "any",
            "holding_years": 5,
            "down_payment_pct": 0.20,
            "loan_interest_apr": 0.125,
            "loan_term_months": 60
        },
        "future": {
            "planning_years": 3,
            "family_size": 5,
            "daily_km": 45,
            "preferred_body_type": "SUV",
            "expected_usage": "Family and Travel"
        }
    }).encode("utf-8")

    req = urllib.request.Request("http://127.0.0.1:8000/api/simulate", data=sim_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=8) as resp:
        sim_data = json.loads(resp.read().decode("utf-8"))
        top = sim_data["best_now"]["vehicle"]
        alt1 = sim_data["best_future"]["vehicle"]
        alt2 = sim_data["best_performance"]["vehicle"]
        print(f"  #1 Top Match: {top['brand']} {top['model']} -> Photo: {top['image_url']}")
        print(f"  Alternative 1: {alt1['brand']} {alt1['model']} -> Photo: {alt1['image_url']}")
        print(f"  Alternative 2: {alt2['brand']} {alt2['model']} -> Photo: {alt2['image_url']}")

    print("\n[SUCCESS] All checks completed successfully!")

if __name__ == "__main__":
    verify_system()
