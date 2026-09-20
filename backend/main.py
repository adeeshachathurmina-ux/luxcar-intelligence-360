import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.vehicles import router as vehicles_router
from routes.simulator import router as simulator_router
from routes.ai import router as ai_router

app = FastAPI(
    title="LuxCar Intelligence 360 API",
    description="AI-Powered Future Vehicle Match and Ownership Simulator Engine",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(vehicles_router)
app.include_router(simulator_router)
app.include_router(ai_router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "system": "LuxCar Intelligence 360",
        "version": "1.0.0",
        "endpoints": ["/api/vehicles", "/api/simulate", "/api/ai/advice", "/api/ai/chat"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
