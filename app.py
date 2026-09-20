import sys
import os
import uvicorn
import gradio as gr

# Add backend directory to Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(CURRENT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from main import app as fastapi_app

# Create a lightweight Gradio interface to satisfy Hugging Face Spaces requirements
with gr.Blocks(title="LuxCar Intelligence 360 API") as demo:
    gr.Markdown("# 🏎️ LuxCar Intelligence 360 - Cloud API Engine")
    gr.Markdown("🟢 **Backend Status:** Live, Active & Fully Operational")
    gr.Markdown("""
    ### Available REST Endpoints:
    - `GET  /` - System Health Check
    - `GET  /docs` - Interactive OpenAPI Documentation
    - `GET  /api/vehicles` - Vehicle Catalogue & Specifications
    - `POST /api/simulate` - Dual-Horizon Suitability & TCO Matching
    - `POST /api/ai/advice` - AI Ownership & Purchase Advisory
    - `POST /api/ai/chat` - Interactive Multilingual Concierge
    """)

# Mount Gradio app to root/subpath
app = gr.mount_gradio_app(fastapi_app, demo, path="/status")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
