from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from engine.ai_advisor import ai_advisor

router = APIRouter(prefix="/api/ai", tags=["AI Advisor"])

class ProfileParseRequest(BaseModel):
    text: str

class AdviceRequest(BaseModel):
    simulation_result: Dict[str, Any]

class ChatRequest(BaseModel):
    question: str
    current_vehicle: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = None

class SetKeyRequest(BaseModel):
    api_key: str

@router.post("/set-key")
def set_gemini_key(req: SetKeyRequest):
    ai_advisor.set_api_key(req.api_key)
    return {"status": "success", "message": "Gemini API key updated successfully!"}

@router.post("/parse-profile")
def parse_profile(req: ProfileParseRequest):
    return ai_advisor.parse_natural_language_profile(req.text)

@router.post("/advice")
def get_executive_advice(req: AdviceRequest):
    advice = ai_advisor.generate_executive_advice(req.simulation_result)
    return {"advice": advice}

@router.post("/chat")
def chat(req: ChatRequest):
    response = ai_advisor.chat_with_concierge(
        question=req.question,
        current_vehicle=req.current_vehicle,
        chat_history=req.chat_history,
    )
    return {"reply": response}
