from fastapi import APIRouter
from pydantic import BaseModel
from app.prompts import PROMPT_MAP
from app.services.llm import generate

router = APIRouter()

class ExplainRequest(BaseModel):
    question: str
    mode: str = "explain"

class ExplainResponse(BaseModel):
    status: str
    answer: str

ALLOWED_MODES = {"explain", "summary", "exam", "steps"}
MAX_QUESTION_LENGTH = 500

NON_STUDY_PATTERNS = ["your name", "who are you", "hi", "hello"]

@router.post("/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest):
    if not req.question.strip():
        return {"status": "EMPTY_INPUT", "answer": "Question cannot be empty"}

    prompt_fn = PROMPT_MAP.get(req.mode)
    if not prompt_fn:
        return {"status": "INVALID_MODE", "answer": "Unsupported mode"}

    prompt = prompt_fn(req.question)
    output = generate(prompt)
    
    if output.startswith("LLM error"):
        return {"status": "LLM_ERROR", "answer": output}

    if output.startswith("GEMINI_API_KEY"):
        return {"status": "CONFIG_ERROR", "answer": output}

    if req.mode not in ALLOWED_MODES:
        return {"answer": "Invalid mode selected"}

    if not req.question.strip():
        return {"answer": "Empty question"}

    if len(req.question) > MAX_QUESTION_LENGTH:
        return {"answer": "Question too long"}

    prompt_fn = PROMPT_MAP[req.mode]
    final_prompt = prompt_fn(req.question)
    result = generate(final_prompt)

   

    return {"status": "OK", "answer": output}