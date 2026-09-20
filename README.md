# 🚗 LuxCar Intelligence 360
### *AI-Powered Vehicle Match & 5-Year Ownership Cost Simulator*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Website-luxcar--intelligence--360.vercel.app-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://luxcar-intelligence-360.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16%2B_(React_19)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776ab?style=for-the-badge&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## 🌐 Try It Live Right Now!
No installation needed! Open the full-stack web application directly in your browser:
👉 **[https://luxcar-intelligence-360.vercel.app/](https://luxcar-intelligence-360.vercel.app/)**

*Works on all modern desktop and mobile browsers with instant 0ms calculation speed!*

---

## 💡 What is LuxCar Intelligence 360?

When buying a car, most people make decisions based only on **the showroom price** and **the exterior look**. A few years later, they run into unexpected problems:
* High fuel bills from daily traffic
* Expensive spare parts and maintenance
* Not enough seats when the family grows
* Rapid loss of vehicle value when reselling

**LuxCar Intelligence 360** solves this. It acts as your personal digital automotive consultant, answering two essential questions:
1. **"Which car is my best match today?"** (Based on your budget, family size, and daily driving distance).
2. **"What will this car actually cost me over 5 years, and what is my best alternative when my lifestyle expands?"**

---

## ✨ Key Features (Simple & Clear)

### 🎯 1. Smart Dual-Horizon Match (Today vs. 3–5 Years Later)
Move simple sliders for your budget, family size, and daily commute. The system scans 40+ popular vehicles and highlights:
* 🏆 **#1 Top Match for Today:** The most practical, comfortable, and affordable choice right now.
* 👶 **Future-Proof Alternative:** A vehicle that fits your expanding family or longer travel needs 3 to 5 years down the road.
* 🏎️ **Sporty Choice & 🛡️ Low-Maintenance Choice:** Immediate runner-up options for quick comparison.

### 💰 2. 5-Year True Cost of Ownership (TCO)
A car's purchase price is only part of what you spend. LuxCar calculates your **real financial bottom line**:
* ⛽ **Fuel Expenses:** Calculated from your daily kilometers and the car’s actual km/L.
* 🔧 **Routine Maintenance:** Scheduled servicing, oil, and filter replacements.
* 🛡️ **Annual Insurance:** Realistic market insurance estimates.
* 🔄 **Money Back (Resale Retention):** Estimated money you get back when you sell the vehicle after 5 years.
* 🎯 **Effective Monthly Cost:** What the car actually costs you per month.

### 🇱🇰 3. Calibrated for the Sri Lankan Market
* Prices shown in **Sri Lankan Millions & Lakhs (LKR)** or **US Dollars (USD)**.
* Realistic fuel rates (Octane 92 / Auto Diesel / CEB Electric tariffs).
* Accurate Sri Lankan secondary market resale value retention tiers (Toyota/Suzuki vs. European luxury).

### 💬 4. LuxAI Assistant (English, සිංහල & Singlish)
Ask any automotive question in plain language:
> *"I have 18M budget, daily 35km travel, need a hybrid SUV"*  
> *"ලක්ෂ 150කට පවුලට හොඳ hybrid SUV එකක් කියන්න"*  
> *"Mata thel wada karana hoda car ekak recommend karanna"*

The AI understands your language, extracts your requirements, and suggests the top matching vehicles with exact prices and fuel economy figures.

### ⚖️ 5. Side-by-Side Vehicle Comparison
Compare any two cars head-to-head on match scores, seating capacity, horsepower, fuel efficiency, reliability ratings, and resale tiers.

### 🎨 6. Luxury Glassmorphism Design
* **5 Interactive Themes:** Midnight, Cyber Colombo, Golden Hour, Hyper Warp, and Futuristic HUD.
* **3D Tilt Cards:** Interactive cards that respond to mouse movement.
* **Interactive Sound FX:** Procedural sports engine rev audio effects.
* **Bookmark & PDF Export:** Save your favorite car recommendations to browser storage or print clean PDF reports.

### 🕹️ 7. Highway Rush Mini-Game
Take a spin on the Southern Expressway! Enjoy a built-in retro arcade driving mini-game with retro sound effects directly in the app.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend UI** | Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion |
| **Backend API** | Python, FastAPI, Uvicorn (Asynchronous REST API) |
| **Data Engine** | Pandas, NumPy, Scikit-Learn (Vehicle clustering & suitability models) |
| **AI Consultant** | Intelligent Multi-Lingual NLP Engine + Optional Google Gemini AI |
| **Hosting** | Vercel Global Edge Network (Frontend) + Standalone 0ms Client Fallback |

---

## 🚀 How to Run Locally (Step-by-Step)

### ⚡ Method 1: 1-Click Start (Windows)
Double-click the **`run_project.bat`** file in the root folder.  
It automatically starts both the Python backend and Next.js frontend, and opens the application in your default browser.

---

### 💻 Method 2: Manual Terminal Start

#### Step 1: Start the Python Backend
Open a terminal in the project directory:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend API: `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger): `http://127.0.0.1:8000/docs`

#### Step 2: Start the Next.js Frontend
Open a second terminal window:
```powershell
cd frontend
npm install
npm run dev -- -p 3000
```
* Open your browser and visit: **`http://localhost:3000`**

---

## 📂 Project Directory Structure

```text
luxcar-intelligence-360/
├── run_project.bat              # 1-Click launcher for Windows
├── README.md                    # Project documentation & overview
├── LICENSE                      # MIT Open-Source License
│
├── backend/                     # Python FastAPI Backend
│   ├── main.py                  # API router & CORS configuration
│   ├── requirements.txt         # Python dependencies
│   ├── data/
│   │   ├── vehicles.csv         # 40+ authentic vehicle specifications
│   │   └── loader.py            # Vehicle data repository
│   ├── engine/
│   │   ├── scoring.py           # Multi-criteria suitability scoring engine
│   │   ├── tco.py               # 5-Year Total Cost of Ownership simulator
│   │   ├── ai_advisor.py        # Natural language car recommendation engine
│   │   └── clustering.py        # Machine learning vehicle clustering
│   └── routes/                  # API endpoints (/simulate, /vehicles, /ai)
│
└── frontend/                    # Next.js 16 Web Application
    ├── app/                     # Next.js App Router (page.tsx, layout.tsx)
    ├── components/              # Interactive UI components
    │   ├── MatchShowcase.tsx    # #1 Winner car & alternative cards
    │   ├── TCOChart.tsx         # 5-Year True Cost timeline breakdown
    │   ├── DecisionCard.tsx     # Strategic buy/wait recommendation
    │   ├── AIChatDrawer.tsx     # Multilingual AI automotive assistant
    │   └── HighwayRushGame.tsx  # Arcade mini-game
    └── lib/
        ├── vehiclesData.json    # Verified 40-vehicle specifications
        ├── clientSimulation.ts  # 0ms standalone client-side match engine
        └── clientAiAdvisor.ts   # Instant client-side AI chat consultant
```

---

## 🌟 Why This Project Stands Out

1. **Addresses Real-World Financial Pain Points:** Helps buyers avoid buyer's remorse by forecasting 5-year running expenses before making a purchase.
2. **True Full-Stack Architecture:** Modern Next.js frontend with clean TypeScript code paired with Python FastAPI backend arithmetic and ML.
3. **Resilient Zero-Downtime Design:** Includes a 0ms client-side fallback engine so the web application remains 100% functional and crash-free anywhere in the world.
4. **Authentic Vehicle Data:** Realistic specifications, genuine exterior photos, and Sri Lankan market price calibrations.

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
