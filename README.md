# 🏎️ LuxCar Intelligence 360
### *AI-Powered Dual-Horizon Vehicle Suitability Match & 5-Year Ownership Simulator*

[![Next.js](https://img.shields.io/badge/Next.js-16%2B_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13%2B-3776ab?style=for-the-badge&logo=python)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine_Learning-f7931e?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4_Glassmorphism-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📌 Executive Overview

**LuxCar Intelligence 360** is an enterprise-grade automotive intelligence platform engineered to revolutionize vehicle purchasing decisions. Built specifically for complex automotive economies like **Sri Lanka** and emerging markets, it solves a fundamental flaw in traditional automotive portals: **Static evaluation**.

Instead of treating vehicle selection as a one-time snapshot, LuxCar Intelligence 360 introduces a **Dual-Horizon Decision Architecture**:
1. **Current Reality Horizon:** Evaluates immediate lifestyle ergonomics, current disposable budget, family count, and daily urban commute.
2. **Projected 3-to-5 Year Horizon:** Simulates non-linear lifestyle changes—such as family expansion, outstation travel shifts, rising fuel tariffs, and asset depreciation.

The system fuses **Unsupervised Machine Learning (K-Means Clustering)**, **Multi-Criteria Decision Making (MCDM)**, **Time-Series Financial Cost Modeling (5-Year TCO)**, **Multilingual NLP Intent Extraction (Sinhala, Singlish, English)**, and an **Automated Real-Time Wikimedia Image Pipeline**.

---

## 🌟 Key Technical Innovations

```
                                  LUXCAR INTELLIGENCE 360 ARCHITECTURE
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                                NEXT.JS LUXURY FRONTEND                                 │
   │  ┌───────────────────────┐  ┌────────────────────────┐  ┌───────────────────────────┐  │
   │  │ Dual-Horizon Sliders  │  │ Interactive Clustering │  │  Retro Highway Rush Game  │  │
   │  │ (Reality vs Horizon)  │  │ 2D Canvas Projection  │  │ Audio Synthesizer & Canvas│  │
   │  └──────────┬────────────┘  └───────────┬────────────┘  └─────────────┬─────────────┘  │
   └─────────────┼───────────────────────────┼─────────────────────────────┼────────────────┘
                 │ HTTP (JSON / REST)        │                             │
   ┌─────────────▼───────────────────────────▼─────────────────────────────▼────────────────┐
   │                                FASTAPI ASYNC BACKEND                                   │
   │  ┌────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  │
   │  │ Multi-Criteria Scoring │  │    K-Means Clustering   │  │  5-Year TCO Simulation  │  │
   │  │  Utility Theory (MAUT) │  │  Scikit-Learn (k=4, Z)  │  │ Depreciation & Finance  │  │
   │  └──────────┬─────────────┘  └───────────┬─────────────┘  └────────────┬────────────┘  │
   │             │                            │                             │               │
   │  ┌──────────▼────────────────────────────▼─────────────────────────────▼────────────┐  │
   │  │  Automated Real-Photo Resolver (Wikimedia Commons & Wikipedia Open API Engine)   │  │
   │  └───────────────────────────────────────┬──────────────────────────────────────────┘  │
   │                                          │                                             │
   │  ┌───────────────────────────────────────▼──────────────────────────────────────────┐  │
   │  │  LuxAI Multilingual Concierge (Gemini 2.5 Flash + Sinhala/Singlish Offline NLP)  │  │
   │  └──────────────────────────────────────────────────────────────────────────────────┘  │
   └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Mathematical & Data Science Foundations

### 1. Dual-Horizon Suitability Scoring (MCDM / MAUT)
Vehicles are scored through an explainable multi-factor composite utility index ($S \in [0, 100]$):

$$\text{Overall Match Score} = w_b \cdot S_{\text{budget}} + w_f \cdot S_{\text{family}} + w_e \cdot S_{\text{efficiency}}$$

*Where default weights are $w_b = 0.40$, $w_f = 0.30$, and $w_e = 0.30$.*

* **Budget Ratio Function ($r = \frac{\text{Price}}{\text{Budget}}$):**
  $$S_{\text{budget}}(r) = \begin{cases} 
  95.0 & \text{if } r \le 0.90 \\
  100.0 & \text{if } 0.90 < r \le 1.05 \\
  \max(50.0, 100 - (r - 1.0) \times 200) & \text{if } 1.05 < r \le 1.20 \\
  \max(20.0, 60 - (r - 1.2) \times 120) & \text{if } 1.20 < r \le 1.50 \\
  15.0 & \text{if } r > 1.50
  \end{cases}$$

* **Non-Linear Family Seating & Cargo Penalty:**
  $$S_{\text{family}} = \begin{cases} 
  25.0 & \text{if } \text{Seats} < \text{Family Size} \quad (\text{Deficit Penalty}) \\
  80.0 + \Delta_{\text{seat}} + \Delta_{\text{boot}} & \text{if } \text{Seats} \ge \text{Family Size}
  \end{cases}$$

* **Commute Efficiency Utility:**
  Calculates fuel economy decay against daily commute distances, balancing hybrid regenerative capability against highway fuel economy.

---

### 2. Unsupervised Machine Learning: K-Means Clustering ($k=4$)
To understand macroeconomic segmentation, vehicle records are projected onto a 4-dimensional normalized feature vector:

$$\mathbf{X} = [\text{Horsepower}, \text{km/L}, \text{Comfort Score}, \text{Reliability Score}]$$

1. **Standardization:** $Z = \frac{X - \mu}{\sigma}$ using `StandardScaler` to eliminate dimensional variance.
2. **Cluster Convergence:** Minimizes cluster inertia:
   $$\arg\min_S \sum_{i=1}^k \sum_{\mathbf{x} \in S_i} \|\mathbf{x} - \boldsymbol{\mu}_i\|^2$$
3. **Silhouette Validation:** Rigorously cross-validated ($\text{Score} \approx 0.40 - 0.68$) to establish mathematically distinct market archetypes:
   - 🟢 **Cluster 0:** *Eco-Hybrid & City Commuter* (Suzuki Wagon R, Toyota Aqua, Toyota Vitz)
   - 🔵 **Cluster 1:** *Mid-Range Crossover & Executive Saloon* (Toyota Premio, Honda Vezel, Toyota Raize)
   - 🟣 **Cluster 2:** *Premium Luxury & Highway Cruiser* (BMW 3 Series G20, Mercedes-Benz W206, Audi A4)
   - 🟡 **Cluster 3:** *Flagship Prestige & High-Clearance Icon* (Toyota Land Cruiser LC300, Defender 110, Porsche Cayenne)

---

### 3. 5-Year Time-Series Total Cost of Ownership (TCO)
Provides a realistic financial trajectory factoring in purchase financing, compound leasing interest, preventative maintenance schedules, and brand-specific depreciation curves:

$$\text{TCO}_5 = (\text{Purchase Price} - \text{Estimated Resale Value}) + \sum_{t=1}^5 (\text{Fuel}_t + \text{Maintenance}_t + \text{Insurance}_t + \text{Finance Cost}_t)$$

* **Non-Linear Depreciation Curve:**
  Factored by Sri Lankan secondary market liquidity tiers (**High Resale** for Japanese kei/crossovers vs **European Tier** luxury holding costs).
* **Dual Currency Engine:** Real-time bi-directional conversion between **Sri Lankan Rupees (LKR - Millions/Lakhs)** and **US Dollars (USD)** with localized formatting.

---

### 4. Automated Real-Photo Resolution Pipeline
Eliminates generic placeholders and static stock photography. When any vehicle is loaded or newly added:
1. **Dynamic Media Query:** Automatically queries Wikimedia Commons & Wikipedia Media APIs using sanitized automotive metadata:
   $$\text{Query} = \text{Brand} + \text{Model} + \text{Generation/Year}$$
2. **Heuristic Filter:** Automatically discards interior, engine bay, steering, dashboard, and tire shots to retain pure exterior side/front three-quarter angles.
3. **Zero-Latency Offline Cache:** Automatically streams and optimizes high-resolution imagery to `/public/images/vehicles/{id}.jpg` for 0ms subsequent retrieval.
4. **100% Unique Catalog:** Every vehicle in the 41+ vehicle catalogue is cryptographically verified (MD5 hash checked) for absolute distinctness.

---

### 5. Multilingual Natural Language Processing (NLP) Engine
Users can input unstructured lifestyle queries in **English**, **Sinhala Script (සිංහල)**, or **Singlish**:
> *"mata 150 lacks walata aduwen thel wada karana 5 denekuta yanna puluwan SUV ekak kiyanna"*

* **Named Entity Recognition (NER):** Extracts budget (`Rs. 15,000,000`), body type (`SUV`), family size (`5`), and priority (`Fuel Economy`).
* **Hybrid Dual AI Execution:**
  - **Online Mode:** Powered by **Google Gemini 2.5 Flash** for deep conversational automotive advice.
  - **Offline Mode:** Built-in rule-based fallback expert system providing instantaneous recommendations even without an API key or internet access.

---

## 🕹️ Interactive Bonus: Highway Rush 2D Canvas Game

Embedded within the application is **Highway Rush**, a retro arcade automotive game built from scratch using HTML5 Canvas and TypeScript:
- **Procedural Traffic Generation:** Dynamic multi-lane obstacle rendering with increasing difficulty curves.
- **Synthesized Audio Engine:** Web Audio API sound synthesis generating custom engine revs, turbo acceleration, and collision audio without external audio files.
- **Real-Time Physics:** Responsive keyboard/touch steering with collision bounding-box detection.

---

## 🛠️ Complete Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components, fast client-side rendering |
| **Language** | **TypeScript 5** | Strict type safety, interfaces, data modeling |
| **Styling & Theme** | **Tailwind CSS 3.4** | Obsidian dark mode (`#080b11`), glassmorphism, responsive UI |
| **Interactive Visuals** | **HTML5 Canvas / Custom SVG** | Radar charts, 2D K-Means cluster explorer, arcade game |
| **Sound Synthesis** | **Web Audio API** | Real-time procedural audio effects & chime feedbacks |
| **Backend Framework** | **FastAPI (ASGI)** | High-throughput asynchronous REST API |
| **Data Science & ML** | **Scikit-Learn, Pandas, NumPy** | Feature scaling, K-Means clustering, silhouette scoring |
| **Validation** | **Pydantic v2** | Request/response schema contracts and type coercion |
| **LLM & AI** | **Google Gemini AI SDK** | Multilingual automotive concierge & executive reporting |
| **Image Engine** | **Wikimedia Commons / Wikipedia API** | Automated dynamic real-vehicle photo retrieval |

---

## 📂 Project Structure

```
new project/
├── README.md                           # Master technical documentation
├── run_project.bat                     # Windows 1-Click launcher
│
├── backend/                            # FastAPI Python Backend
│   ├── main.py                         # Application entrypoint & CORS setup
│   ├── requirements.txt                # Python dependencies
│   ├── download_vehicle_images.py      # Automated real photo download pipeline
│   ├── resolve_all_cars.py             # Wikimedia Commons batch resolver
│   ├── test_backend.py                 # Comprehensive automated test suite
│   ├── data/
│   │   ├── vehicles.csv                # 41+ vehicle catalogue (Specs, Prices, Ratings)
│   │   └── loader.py                   # In-memory repository with filtering & evolution
│   ├── engine/
│   │   ├── scoring.py                  # MCDM multi-criteria scoring engine
│   │   ├── tco.py                      # 5-year financial TCO & depreciation simulator
│   │   ├── clustering.py               # K-Means machine learning clustering (k=4)
│   │   ├── ai_advisor.py               # Gemini AI & offline Sinhala/Singlish NLP
│   │   └── image_fetcher.py            # Automated Wikimedia real-photo fetcher
│   └── routes/
│       ├── vehicles.py                 # Catalogue, photo-proxy & add-vehicle endpoints
│       ├── simulator.py                # Dual-horizon match & TCO endpoints
│       └── ai.py                       # Chat concierge & executive advisory endpoints
│
└── frontend/                           # Next.js 16 TypeScript Luxury UI
    ├── package.json
    ├── app/
    │   ├── layout.tsx                  # Global luxury layout & font configuration
    │   ├── page.tsx                    # Master Interactive Intelligence Dashboard
    │   └── globals.css                 # Glassmorphism, glow effects, slider aesthetics
    └── components/
        ├── Navbar.tsx                  # Brand header, currency switch, sound FX toggle
        ├── HeroSection.tsx             # Natural language AI prompt bar & stats
        ├── SimulatorControls.tsx       # Dual-Horizon interactive sliders
        ├── MatchShowcase.tsx           # Spotlight cards (Best Now vs Future Alternative)
        ├── DataScienceExplorer.tsx     # 2D K-Means cluster scatter plot & metrics
        ├── ScoreBreakdownRadar.tsx     # Explainable score vector radar visualization
        ├── TCOChart.tsx                # Year-by-year 5-year ownership cost table
        ├── DecisionCard.tsx            # "Wait or Buy Now?" Strategic recommendation
        ├── EvolutionTracker.tsx        # Cross-generation automotive spec comparisons
        ├── AIChatDrawer.tsx            # Slide-over LuxAI concierge assistant
        ├── AddVehicleModal.tsx         # Live photo auto-preview & vehicle creator
        ├── HighwayRushGame.tsx         # Retro 2D canvas automotive arcade game
        ├── AutomotiveBackdrop.tsx      # Ambient particle glow canvas background
        ├── VehicleImageResolver.ts     # Client-side 0ms photo resolution engine
        ├── AudioEffects.ts             # Web Audio API procedural sound engine
        └── Icons.tsx                   # Precision SVG vector luxury icon collection
```

---

## 🚀 Quick Start Guide

### Option 1: One-Click Launch (Windows)
Double-click [`run_project.bat`](run_project.bat) in the root directory. It automatically:
1. Activates Python backend venv and launches **FastAPI** on `http://127.0.0.1:8000`.
2. Starts the **Next.js** dev server on `http://localhost:3000`.
3. Opens your default web browser automatically.

---

### Option 2: Manual Terminal Execution

#### 1. Backend Setup (FastAPI)
```powershell
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run backend test suite
python test_backend.py

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup (Next.js)
```powershell
# Open a second terminal and navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev -- -p 3000
```
- **Application URL:** `http://localhost:3000`

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/vehicles` | `GET` | List all vehicles with optional filters (brand, body, fuel, price) |
| `/api/vehicles/{id}` | `GET` | Retrieve full technical specifications of a specific vehicle |
| `/api/vehicles/evolution/{brand}/{model}` | `GET` | Chronological generational evolution tracking (e.g. F30 → G20) |
| `/api/vehicles` | `POST` | Add a new vehicle with automatic real-photo resolution |
| `/api/vehicles/auto-photo` | `POST` | Dynamic search query returning authentic Wikimedia photo preview |
| `/api/simulator/simulate` | `POST` | Execute dual-horizon match scoring across catalogue |
| `/api/simulator/tco` | `POST` | 5-Year time-series total cost of ownership calculation |
| `/api/simulator/clustering` | `GET` | Retrieve K-Means centroids, 2D coordinates & silhouette metrics |
| `/api/ai/chat` | `POST` | Interactive query with LuxAI concierge (Gemini or offline fallback) |
| `/api/ai/report` | `POST` | Generate executive purchase advisory report |

---

## 💼 Why This Project Stands Out to Recruiters & Engineering Leads

- **Full-Stack Competency:** Seamless integration between a modern **TypeScript/React 19 Next.js** frontend and a high-performance **Python FastAPI** backend.
- **Academic & Mathematical Rigor:** Uses real **Unsupervised Machine Learning (K-Means, Silhouette Validation)** and **MCDM Utility Modeling**, not hardcoded dummy data.
- **Real-World Localization:** Fully engineered with domain knowledge of the Sri Lankan automotive market (LKR millions/lakhs currency formats, import resale tiers, fuel price formulas).
- **Production Polish:** Zero UI placeholders, custom glassmorphism styling, Web Audio procedural sound generation, and a complete automated real-photo pipeline.
- **Clean Architecture & Separation of Concerns:** Modular micro-services structure with separate routing, algorithmic engines, data layers, and UI components.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
