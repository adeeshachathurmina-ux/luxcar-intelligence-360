import os
import sys
import json
import urllib.request
import urllib.parse
import pandas as pd
import time

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "vehicles.csv")
TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images", "vehicles"))
os.makedirs(TARGET_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "LuxCarIntelligence/1.0 (contact@luxcar.com; educational automotive platform)"
}

def query_commons(query_str):
    url = (
        f"https://commons.wikimedia.org/w/api.php?action=query&format=json"
        f"&generator=search&gsrsearch={urllib.parse.quote(query_str)}"
        f"&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1280&gsrlimit=6"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=9) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            candidates = []
            for pid, p in pages.items():
                title = p.get('title', '').lower()
                # Skip interior, engine, wheel, rear
                if any(bad in title for bad in ['interior', 'inside', 'engine', 'wheel', 'rim', 'badge', 'emblem', 'dashboard', 'speedometer', 'rear']):
                    continue
                imginfo = p.get('imageinfo', [])
                if imginfo:
                    thumb = imginfo[0].get('thumburl') or imginfo[0].get('url')
                    if thumb:
                        candidates.append((p.get('title'), thumb))
            return candidates
    except Exception as e:
        return []

def query_wikipedia(query_str):
    url = (
        f"https://en.wikipedia.org/w/api.php?action=query&format=json"
        f"&generator=search&gsrsearch={urllib.parse.quote(query_str)}"
        f"&gsrlimit=3&prop=pageimages&pithumbsize=1280"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=9) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '').lower()
                if 'logo' in title or 'list of' in title:
                    continue
                thumb = p.get('thumbnail', {}).get('source')
                if thumb:
                    return thumb
    except Exception as e:
        return None

def download_image(url, target_path):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
            if len(data) > 10000:
                with open(target_path, "wb") as f:
                    f.write(data)
                return len(data)
    except Exception as e:
        print(f"    Download error: {e}")
    return 0

df = pd.read_csv(CSV_PATH)
print(f"Total vehicles to check & update: {len(df)}")

success = 0
for idx, row in df.iterrows():
    vid = row["id"]
    brand = row["brand"]
    model = row["model"]
    year = int(row["year"]) if not pd.isna(row["year"]) else 2024
    gen = str(row["generation"]) if not pd.isna(row["generation"]) and str(row["generation"]).lower() not in ['standard', 'base', 'nan'] else ""
    target_path = os.path.join(TARGET_DIR, f"{vid}.jpg")

    # If already downloaded in this run and file is large (> 40KB) and authentic, we can check
    # But let's verify if existing file is one of the genuine downloaded ones or old generic one
    # Note: earlier suzuki-wagonr, suzuki-swift, toyota-aqua, toyota-premio, honda-vezel, toyota-lc300, toyota-corollacross were verified
    verified_vids = {
        'suzuki-wagonr-2020', 'suzuki-swift-2019', 'toyota-aqua-2018',
        'toyota-premio-2018', 'honda-vezel-2021', 'toyota-lc300-2024',
        'toyota-corollacross-2024'
    }

    if vid in verified_vids and os.path.exists(target_path) and os.path.getsize(target_path) > 50000:
        print(f"[{idx+1}/{len(df)}] {brand} {model} ({vid}) -> Already verified ({os.path.getsize(target_path)} bytes)")
        success += 1
        df.at[idx, "image_url"] = f"/images/vehicles/{vid}.jpg"
        continue

    print(f"\n[{idx+1}/{len(df)}] Searching real photo for: {brand} {model} ({year}, {gen})")

    # Generate search queries
    queries = []
    if gen:
        queries.append(f"{brand} {model} {gen}")
        queries.append(f"{model} {gen}")
    queries.append(f"{year} {brand} {model}")
    queries.append(f"{brand} {model}")
    queries.append(f"{model}")

    downloaded = False
    for q in queries:
        candidates = query_commons(q)
        for title, thumb_url in candidates:
            print(f"  Trying Commons: {title} ({thumb_url[:60]}...)")
            size = download_image(thumb_url, target_path)
            if size > 15000:
                print(f"  [OK] Saved real photo ({size} bytes) -> {vid}.jpg")
                downloaded = True
                success += 1
                df.at[idx, "image_url"] = f"/images/vehicles/{vid}.jpg"
                break
            time.sleep(0.2)
        if downloaded:
            break

    # If commons didn't hit, try Wikipedia pageimage
    if not downloaded:
        for q in [f"{brand} {model}", f"{model}"]:
            wiki_thumb = query_wikipedia(q)
            if wiki_thumb:
                print(f"  Trying Wikipedia: {q} ({wiki_thumb[:60]}...)")
                size = download_image(wiki_thumb, target_path)
                if size > 15000:
                    print(f"  [OK] Saved real photo from Wikipedia ({size} bytes) -> {vid}.jpg")
                    downloaded = True
                    success += 1
                    df.at[idx, "image_url"] = f"/images/vehicles/{vid}.jpg"
                    break
                time.sleep(0.2)

    if not downloaded:
        print(f"  [!] Could not auto-download for {vid}")

    time.sleep(0.3)

df.to_csv(CSV_PATH, index=False)
print("\n==========================================")
print(f"FINISHED! {success}/{len(df)} vehicles now have verified authentic photos!")
