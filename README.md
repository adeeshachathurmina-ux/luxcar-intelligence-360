# 🚗 LuxCar Intelligence 360
### *Your Smart AI Car Buying Assistant & 5-Year Ownership Cost Predictor*

[![Next.js](https://img.shields.io/badge/Next.js-16%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13%2B-3776ab?style=for-the-badge&logo=python)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_Dark_UI-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 What is LuxCar Intelligence 360?

Buying a vehicle is one of the biggest financial decisions most people make. Usually, people only look at two things: **the car's price today** and **how it looks**.

**LuxCar Intelligence 360** changes that. It helps you answer two critical questions:
1. **"Does this car fit my life today?"** (Your current budget, family size, and daily drive)
2. **"Will it still fit me in 3 to 5 years, and what will it actually cost to own?"** (Growing family, rising fuel prices, maintenance, and resale value)

It combines an easy-to-use modern web interface with smart algorithms to give you **honest, data-driven vehicle recommendations** tailored for markets like **Sri Lanka** and beyond.

---

## ✨ Key Features Anyone Will Love

### 1. 🎯 Smart Match (Now vs. 5 Years Later)
Move simple sliders for your budget, family size, and daily commute. The system instantly scores over 40+ vehicles and shows you:
* **Best Match for Today:** The most practical choice for right now.
* **Smart Future Alternative:** A car that might save you more money or suit your lifestyle better in 3–5 years.

### 2. 💰 5-Year Real Cost Calculator (TCO)
A car's sticker price is only half the story. LuxCar calculates your **Total Cost of Ownership** over 5 years:
* ⛽ Fuel expenses based on your daily travel
* 🔧 Regular maintenance & servicing costs
* 🛡️ Annual insurance
* 📉 Vehicle depreciation (estimated resale value after 5 years)
* 💱 Supports both **Sri Lankan Rupees (LKR Millions/Lakhs)** and **US Dollars (USD)**

### 3. 🧠 Smart Vehicle Categories
Using machine learning, cars are automatically grouped into 4 clear categories so you can quickly see where each vehicle fits:
* 🟢 **Eco City Commuters** *(Suzuki Wagon R, Toyota Aqua, Vitz)* - Maximum fuel savings
* 🔵 **Family Crossovers & Sedans** *(Toyota Premio, Honda Vezel, Raize)* - Balanced comfort & reliability
* 🟣 **Luxury Highway Cruisers** *(BMW 3 Series, Mercedes C-Class, Audi A4)* - Premium drive & prestige
* 🟡 **Prestige SUVs** *(Land Cruiser LC300, Defender 110, Porsche Cayenne)* - Ultimate power & space

### 4. 💬 LuxAI Assistant (Sinhala, Singlish & English)
Need advice? Chat directly with the built-in AI concierge in the language you are most comfortable with:
> *"Mata 150 lacks walata aduwen thel wada karana 5 denekuta yanna puluwan SUV ekak kiyanna"*

The AI extracts your budget, family needs, and priorities to give you instant, personalized advice.

### 5. 🖼️ Real Vehicle Photos (No Fake Placeholders)
Every car in the catalog features authentic, high-quality exterior photos automatically pulled from Wikimedia Commons.

### 6. 🕹️ Bonus: Retro Highway Rush Game!
Take a quick break and play **Highway Rush**—a retro 2D arcade driving game built directly into the app with authentic engine sound effects!

---

## 🛠️ Built With

* **Frontend:** Next.js 16 (React 19), TypeScript, Tailwind CSS (Obsidian Luxury Dark Theme)
* **Backend:** Python, FastAPI (Fast, lightweight asynchronous API)
* **Data & Intelligence:** Scikit-Learn (Vehicle clustering), Pandas, NumPy
* **AI & NLP:** Google Gemini AI + Offline Sinhala/Singlish rule parser
* **Audio:** Web Audio API (Synthesized procedural sound effects)

---

## 🚀 How to Run the Project (Super Easy)

### ⚡ Method 1: One-Click Start (Windows)
Simply double-click the **`run_project.bat`** file in the project folder.  
It will automatically start both the backend and frontend, and open your browser!

---

### 💻 Method 2: Manual Start via Terminal

#### Step 1: Start the Backend (Python)
Open a terminal in the project folder:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend will be live at: `http://127.0.0.1:8000`
* API Documentation: `http://127.0.0.1:8000/docs`

#### Step 2: Start the Frontend (Next.js)
Open a second terminal window:
```powershell
cd frontend
npm install
npm run dev -- -p 3000
```
* Open your browser and visit: **`http://localhost:3000`**

---

## 📂 Project Structure at a Glance

```text
luxcar-intelligence-360/
├── run_project.bat            # 1-Click launcher for Windows
├── README.md                  # Project documentation
│
├── backend/                   # Python FastAPI Backend
│   ├── main.py                # Server entry point
│   ├── data/vehicles.csv      # 40+ vehicle specs, prices, and ratings
│   ├── engine/                # Core logic (Cost calculator, smart match, AI)
│   └── routes/                # API endpoints
│
└── frontend/                  # Next.js TypeScript UI
    ├── app/                   # Main page & layout
    ├── components/            # UI components (Sliders, Cards, Cost Charts, AI Chat)
    └── public/                # Vehicle photos, videos & icons
```

---

## 🌟 Why This Project is Special

* **Practical & Real-World:** Solves real car-buying dilemmas instead of just being another dummy listing site.
* **Full-Stack Power:** Modern React/Next.js frontend connected seamlessly to a Python FastAPI backend.
* **Zero Dummy Data:** Real specifications, real market depreciation trends, and authentic photos for all 40+ vehicles.
* **Intuitive UI:** Clean luxury glassmorphism design with responsive sliders, sound effects, and interactive charts.

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
