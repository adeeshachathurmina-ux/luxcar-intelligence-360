import os
import sys
import pandas as pd
import time

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass



sys.path.insert(0, os.path.dirname(__file__))
from engine.image_fetcher import (
    search_real_vehicle_photo,
    download_and_save_vehicle_image,
    MODEL_VERIFIED_PHOTO_CACHE,
    DEFAULT_TARGET_DIR
)

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "vehicles.csv")
df = pd.read_csv(CSV_PATH)

print(f"Starting real vehicle photos download pipeline for {len(df)} vehicles...")
os.makedirs(DEFAULT_TARGET_DIR, exist_ok=True)

success_count = 0
updated_rows = []

for idx, row in df.iterrows():
    v_id = row["id"]
    brand = row["brand"]
    model = row["model"]
    year = int(row["year"]) if not pd.isna(row["year"]) else 2024
    gen = str(row["generation"]) if not pd.isna(row["generation"]) else ""
    target_file = os.path.join(DEFAULT_TARGET_DIR, f"{v_id}.jpg")

    print(f"\n[{idx+1}/{len(df)}] Processing {brand} {model} ({year}, {gen}) -> ID: {v_id}")

    # Search authentic real photo URL
    real_url = search_real_vehicle_photo(
        brand=brand,
        model=model,
        year=year,
        generation=gen,
        vehicle_id=v_id
    )

    if not real_url:
        print(f"  [-] Could not resolve real photo URL for {v_id}")
        continue

    print(f"  [+] Resolved Real Photo: {real_url[:80]}...")
    saved_path = download_and_save_vehicle_image(real_url, v_id, DEFAULT_TARGET_DIR)
    
    if saved_path:
        print(f"  [OK] Saved authentic photo to {saved_path}")
        success_count += 1
        df.at[idx, "image_url"] = saved_path
    else:
        print(f"  [!] Failed downloading {real_url}")

    # Brief courtesy pause between external requests
    time.sleep(0.3)

# Save updated CSV with guaranteed local image URLs
df.to_csv(CSV_PATH, index=False)
print(f"\n==========================================")
print(f"Pipeline Completed: {success_count}/{len(df)} vehicles updated with genuine real photos!")
print(f"Updated CSV saved to {CSV_PATH}")

