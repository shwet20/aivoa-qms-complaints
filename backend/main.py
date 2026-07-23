from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from agent import complaint_agent

app = FastAPI(title="AIVOA QMS Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str
    action_type: str = "log" # "log" or "edit"
    current_form_data: Optional[Dict[str, Any]] = None

@app.post("/api/chat")
def handle_chat(payload: ChatRequest):
    result = complaint_agent.invoke({
        "input_text": payload.prompt,
        "action_type": payload.action_type,
        "current_form_data": payload.current_form_data,
        "final_output": None
    })
    return result["final_output"]

@app.post("/api/extract-document")
async def extract_document(file: UploadFile = File(...), current_form_data: Optional[str] = Form(None)):
    contents = await file.read()
    filename = file.filename
    
    # Mock text extracted from typical Pharma Complaint PDF/Email
    document_text = f"""
    DOCUMENT EXTRACTION ({filename}):
    Customer: Global Pharma Distributors
    Product Name: Metformin Hydrochloride API
    Grade/Strength: IP/BP Grade
    Batch/Lot Number: MFH260712A
    Manufacturing Date: 2025-06-15
    Expiry Date: 2028-06-14
    Affected Quantity: 100 kg
    Issue: High moisture content observed during incoming quality check. Package seal damaged.
    """
    
    parsed_current = json.loads(current_form_data) if current_form_data else {}
    
    result = complaint_agent.invoke({
        "input_text": document_text,
        "action_type": "document",
        "current_form_data": parsed_current,
        "final_output": None
    })
    return result["final_output"]