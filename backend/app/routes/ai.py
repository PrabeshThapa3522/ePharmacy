from fastapi import APIRouter

from app.schemas.ai import AIChatRequest, AIChatResponse
from app.services.ai_service import get_ai_response


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


@router.post("/chat", response_model=AIChatResponse)
def chat_with_ai(request: AIChatRequest):
    response = get_ai_response(request.message)

    return {
        "response": response
    }