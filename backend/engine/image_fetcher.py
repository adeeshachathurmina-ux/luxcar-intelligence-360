import os
import json
import urllib.request
import urllib.parse
from typing import Optional, List, Tuple

DEFAULT_TARGET_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "images", "vehicles")
)

USER_AGENT = "LuxCarIntelligence/1.0 (contact@luxcar.com; educational research automotive platform)"
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml,image/webp,image/apng,*/*;q=0.8",
}

# Verified high-definition fallback repository for models to guarantee instant resolution
MODEL_VERIFIED_PHOTO_CACHE = {
    # Suzuki
    "suzuki-wagonr-2020": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/The_frontview_of_Suzuki_WAGON_R_HYBRID_FX_%28DAA-MH55S%29.jpg/1280px-The_frontview_of_Suzuki_WAGON_R_HYBRID_FX_%28DAA-MH55S%29.jpg",
    "suzuki-swift-2019": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Suzuki_SWIFT_RSt_%28DBA-ZC13S-VBTK-JN%29.jpg/1280px-Suzuki_SWIFT_RSt_%28DBA-ZC13S-VBTK-JN%29.jpg",
    # Toyota
    "toyota-aqua-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/2017-2021_Toyota_Aqua.jpg/1280px-2017-2021_Toyota_Aqua.jpg",
    "toyota-vitz-2019": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2017_Toyota_Vitz_%28KSP130%29_1.0_F_Amie_front.jpg/1280px-2017_Toyota_Vitz_%28KSP130%29_1.0_F_Amie_front.jpg",
    "toyota-raize-2021": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2020_Toyota_Raize_Z_4WD%2C_front_left.jpg/1280px-2020_Toyota_Raize_Z_4WD%2C_front_left.jpg",
    "toyota-premio-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Toyota_PREMIO_1.5F_EX_Package_%28DBA-NZT260-AEXEK%29_front.jpg/1280px-Toyota_PREMIO_1.5F_EX_Package_%28DBA-NZT260-AEXEK%29_front.jpg",
    "toyota-allion-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Toyota_ALLION_A15_G_Package_%28DBA-NZT260-CEXEK%29_front.jpg/1280px-Toyota_ALLION_A15_G_Package_%28DBA-NZT260-CEXEK%29_front.jpg",
    "toyota-chr-2019": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/2018_Toyota_C-HR_Excel_HEV_1.8_Front.jpg/1280px-2018_Toyota_C-HR_Excel_HEV_1.8_Front.jpg",
    "toyota-corollacross-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg/1280px-2023_Toyota_Corolla_Cross_XLE_4WD_in_Wind_Chill_Pearl%2C_front_left.jpg",
    "toyota-rav4-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/2019_Toyota_RAV4_LE_AWD_front_3.16.19.jpg/1280px-2019_Toyota_RAV4_LE_AWD_front_3.16.19.jpg",
    "toyota-prado-2022": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Toyota_Land_Cruiser_Prado_TX_L_Package_Black_Edition_%283BA-TRJ150W-GGTEK%29_front.jpg/1280px-Toyota_Land_Cruiser_Prado_TX_L_Package_Black_Edition_%283BA-TRJ150W-GGTEK%29_front.jpg",
    "toyota-prado-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2024_Toyota_Land_Cruiser_First_Edition_%28United_States%29_front_view_01.png/1280px-2024_Toyota_Land_Cruiser_First_Edition_%28United_States%29_front_view_01.png",
    "toyota-lc300-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png/1280px-2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png",
    # Honda
    "honda-vezel-2021": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/2021-2024_Honda_Vezel_e-HEV_X.jpg/1280px-2021-2024_Honda_Vezel_e-HEV_X.jpg",
    "honda-grace-2019": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Honda_GRACE_HYBRID_EX_Honda_SENSING_%28DAA-GM4%29_front.jpg/1280px-Honda_GRACE_HYBRID_EX_Honda_SENSING_%28DAA-GM4%29_front.jpg",
    "honda-crv-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/2023_Honda_CR-V_Hybrid_Sport_Touring%2C_front_left.jpg/1280px-2023_Honda_CR-V_Hybrid_Sport_Touring%2C_front_left.jpg",
    # BYD
    "byd-atto3-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/BYD_Atto_3_1X7A6265.jpg/1280px-BYD_Atto_3_1X7A6265.jpg",
    "byd-seal-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/BYD_Seal_001_Mondial_de_l%27Automobile_de_Paris_2022.jpg/1280px-BYD_Seal_001_Mondial_de_l%27Automobile_de_Paris_2022.jpg",
    # BMW
    "bmw-3-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/2012_BMW_318d_Sport_Automatic_2.0.jpg/1280px-2012_BMW_318d_Sport_Automatic_2.0.jpg",
    "bmw-3-2021": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/2019_BMW_320i_M_Sport_Automatic_2.0_Front.jpg/1280px-2019_BMW_320i_M_Sport_Automatic_2.0_Front.jpg",
    "bmw-3-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/2023_BMW_330e_M_Sport_Saloon.jpg/1280px-2023_BMW_330e_M_Sport_Saloon.jpg",
    "bmw-m340i-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/2020_BMW_M340i_xDrive_3.0.jpg/1280px-2020_BMW_M340i_xDrive_3.0.jpg",
    "bmw-x3-2022": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2018_BMW_X3_xDrive20d_M_Sport_Automatic_2.0_Front.jpg/1280px-2018_BMW_X3_xDrive20d_M_Sport_Automatic_2.0_Front.jpg",
    "bmw-x5-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2019_BMW_X5_xDrive30d_M_Sport_Automatic_3.0_Front.jpg/1280px-2019_BMW_X5_xDrive30d_M_Sport_Automatic_3.0_Front.jpg",
    # Mercedes-Benz
    "mb-c-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2015_Mercedes-Benz_C200_AMG_Line_2.0_Front.jpg/1280px-2015_Mercedes-Benz_C200_AMG_Line_2.0_Front.jpg",
    "mb-c-2022": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Mercedes-Benz_W206_IMG_6380.jpg/1280px-Mercedes-Benz_W206_IMG_6380.jpg",
    "mb-c-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/2022_Mercedes-Benz_C300e_AMG_Line_Front.jpg/1280px-2022_Mercedes-Benz_C300e_AMG_Line_Front.jpg",
    "mb-glc-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mercedes-Benz_X254_IMG_7030.jpg/1280px-Mercedes-Benz_X254_IMG_7030.jpg",
    "mb-e-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Mercedes-Benz_W214_IMG_9771.jpg/1280px-Mercedes-Benz_W214_IMG_9771.jpg",
    # Audi
    "audi-a4-2020": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2016_Audi_A4_Sport_TDi_Quattro_2.0_Front.jpg/1280px-2016_Audi_A4_Sport_TDi_Quattro_2.0_Front.jpg",
    "audi-a4-2023": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2020_Audi_A4_35_TFSi_S_Line_2.0_Front.jpg/1280px-2020_Audi_A4_35_TFSi_S_Line_2.0_Front.jpg",
    "audi-q5-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/2018_Audi_Q5_S_Line_TDi_Quattro_2.0_Front.jpg/1280px-2018_Audi_Q5_S_Line_TDi_Quattro_2.0_Front.jpg",
    # Lexus
    "lexus-nx-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2022_Lexus_NX_350h_F_Sport_AWD_in_Ultrasonic_Blue_Mica_2.0%2C_Front_Right%2C_04-09-2022.jpg/1280px-2022_Lexus_NX_350h_F_Sport_AWD_in_Ultrasonic_Blue_Mica_2.0%2C_Front_Right%2C_04-09-2022.jpg",
    "lexus-rx-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2023_Lexus_RX_350_AWD_in_Eminent_White_Pearl%2C_front_right.jpg/1280px-2023_Lexus_RX_350_AWD_in_Eminent_White_Pearl%2C_front_right.jpg",
    # Land Rover
    "landrover-defender-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/2020_Land_Rover_Defender_110_First_Edition_D240_2.0_Front.jpg/1280px-2020_Land_Rover_Defender_110_First_Edition_D240_2.0_Front.jpg",
    "rangerover-sport-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2023_Land_Rover_Range_Rover_Sport_Dynamic_SE_P400_Front.jpg/1280px-2023_Land_Rover_Range_Rover_Sport_Dynamic_SE_P400_Front.jpg",
    # Porsche
    "porsche-macan-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/2019_Porsche_Macan_S_Automatic_3.0_Front.jpg/1280px-2019_Porsche_Macan_S_Automatic_3.0_Front.jpg",
    "porsche-cayenne-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/2018_Porsche_Cayenne_E-Hybrid_3.0_Front.jpg/1280px-2018_Porsche_Cayenne_E-Hybrid_3.0_Front.jpg",
    # Tesla, Hyundai, Volvo
    "tesla-modely-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2021_Tesla_Model_Y_Long_Range_AWD_front_view_%28United_States%29.jpg/1280px-2021_Tesla_Model_Y_Long_Range_AWD_front_view_%28United_States%29.jpg",
    "hyundai-ioniq5-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hyundai_Ioniq_5_Auto_Zuerich_2021_IMG_0396.jpg/1280px-Hyundai_Ioniq_5_Auto_Zuerich_2021_IMG_0396.jpg",
    "volvo-xc60-2024": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/2018_Volvo_XC60_Inscription_Pro_D4_AWD_2.0_Front.jpg/1280px-2018_Volvo_XC60_Inscription_Pro_D4_AWD_2.0_Front.jpg"
}


def search_commons_for_photo(query: str, limit: int = 6) -> Optional[str]:
    """Searches Wikimedia Commons specifically for exterior automotive photographs."""
    url = (
        f"https://commons.wikimedia.org/w/api.php?action=query&format=json"
        f"&generator=search&gsrsearch={urllib.parse.quote(query)}"
        f"&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=1280&gsrlimit={limit}"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=9) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for pid, page in pages.items():
                title = page.get("title", "").lower()
                # Skip interior, engine, wheel, rear views if possible
                if any(bad in title for bad in ["interior", "inside", "engine", "wheel", "rim", "rear", "back", "diagram", "badge", "emblem"]):
                    continue
                imginfo = page.get("imageinfo", [])
                if imginfo:
                    thumb = imginfo[0].get("thumburl") or imginfo[0].get("url")
                    if thumb:
                        return thumb
    except Exception as e:
        print(f"Commons search error for '{query}': {e}")
    return None


def search_wikipedia_pageimage(query: str) -> Optional[str]:
    """Searches English Wikipedia and returns the high-res thumbnail of the lead article image."""
    url = (
        f"https://en.wikipedia.org/w/api.php?action=query&format=json"
        f"&generator=search&gsrsearch={urllib.parse.quote(query)}"
        f"&gsrlimit=3&prop=pageimages&pithumbsize=1280"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=9) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for pid, page in pages.items():
                thumb = page.get("thumbnail", {}).get("source")
                title = page.get("title", "").lower()
                # Avoid generic manufacturer logos or unrelated pages
                if "logo" in title or "list of" in title:
                    continue
                if thumb:
                    return thumb
    except Exception as e:
        print(f"Wikipedia pageimage error for '{query}': {e}")
    return None


def search_real_vehicle_photo(
    brand: str,
    model: str,
    year: Optional[int] = None,
    generation: Optional[str] = None,
    vehicle_id: Optional[str] = None,
) -> Optional[str]:
    """Intelligently locates an authentic real vehicle photograph."""
    # 1. First check pre-verified catalog if vehicle_id is provided
    if vehicle_id and vehicle_id in MODEL_VERIFIED_PHOTO_CACHE:
        return MODEL_VERIFIED_PHOTO_CACHE[vehicle_id]

    # Formulate prioritized search queries
    clean_brand = brand.strip()
    clean_model = model.strip()
    clean_gen = (generation or "").strip()
    clean_year = str(year) if year else ""

    queries = []
    if clean_gen and clean_gen.lower() not in ["standard", "base"]:
        queries.append(f"{clean_brand} {clean_model} {clean_gen}")
    if clean_year:
        queries.append(f"{clean_year} {clean_brand} {clean_model}")
        queries.append(f"{clean_brand} {clean_model} {clean_year}")
    queries.append(f"{clean_brand} {clean_model}")

    # Try Commons first for specific exterior shots
    for q in queries:
        photo = search_commons_for_photo(q)
        if photo:
            return photo

    # Try Wikipedia main articles
    for q in queries:
        photo = search_wikipedia_pageimage(q)
        if photo:
            return photo

    # Fallback to model-name matching against cache
    search_key = f"{clean_brand} {clean_model}".lower()
    for vid, url in MODEL_VERIFIED_PHOTO_CACHE.items():
        if all(part.lower() in vid for part in clean_model.split()):
            return url

    return None


def download_and_save_vehicle_image(
    source_url: str,
    vehicle_id: str,
    target_dir: str = DEFAULT_TARGET_DIR,
) -> Optional[str]:
    """Downloads the real vehicle photo and saves it locally in public/images/vehicles/{vehicle_id}.jpg."""
    os.makedirs(target_dir, exist_ok=True)
    target_file = os.path.join(target_dir, f"{vehicle_id}.jpg")

    try:
        # If the URL is already clean upload.wikimedia.org, ensure User-Agent is set
        req = urllib.request.Request(source_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=14) as resp:
            data = resp.read()
            if len(data) > 8000:
                with open(target_file, "wb") as f:
                    f.write(data)
                print(f"Successfully saved {vehicle_id}.jpg ({len(data)} bytes)")
                return f"/images/vehicles/{vehicle_id}.jpg"
    except Exception as e:
        print(f"Error downloading image from {source_url} for {vehicle_id}: {e}")

    return None
