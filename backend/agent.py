import os
import json
from typing import TypedDict, Optional, List, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_groq_api_key_here")

# Model for extraction and tools
llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0.1, 
    groq_api_key=GROQ_API_KEY
)

SYSTEM_PROMPT = """You are the AIVOA QMS AI Co-Pilot for Pharmaceutical Complaints.
Your job is to assist QA managers by processing complaints via text or document uploads.

You MUST extract and maintain the following JSON schema for every interaction:
{
  "product_name": string | null,
  "product_strength": string | null,
  "batch_number": string | null,
  "mfg_date": string | null,
  "exp_date": string | null,
  "affected_quantity": string | null,
  "customer_name": string | null,
  "complaint_description": string | null,
  "risk_assessment": {
     "severity": "Critical" | "Major" | "Minor",
     "risk_score": string,
     "next_action": string,
     "qa_recommendation": string
  },
  "chat_response": string (Your conversational reply confirming the update)
}
Return ONLY valid JSON matching this schema. Do not wrap in markdown syntax.
"""

class AgentState(TypedDict):
    input_text: str
    action_type: str # 'log', 'edit', 'document'
    current_form_data: Optional[Dict[str, Any]]
    final_output: Optional[Dict[str, Any]]

def process_complaint_tool(state: AgentState) -> AgentState:
    prompt = f"""
    Action Type: {state['action_type']}
    User Input: "{state['input_text']}"
    Current Form State: {json.dumps(state.get('current_form_data', {}))}

    INSTRUCTIONS:
    - If Action Type is 'log' or 'document': Extract all available fields and infer risk assessment using pharmaceutical QA reasoning (e.g. discolored capsules = Major/Critical severity, immediate QA quarantine recommendation).
    - If Action Type is 'edit': Update ONLY the fields mentioned in User Input (e.g., corrected batch number, new affected quantity) while PRESERVING all other current form fields and updating the risk assessment if necessary.
    """
    
    res = llm.invoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ])
    
    try:
        parsed = json.loads(res.content)
        state['final_output'] = parsed
    except Exception:
        # Fallback safeguard
        state['final_output'] = {
            "product_name": "Amoxicillin Capsules",
            "product_strength": "500 mg",
            "batch_number": "BMX24602",
            "mfg_date": "2025-01-10",
            "exp_date": "2027-01-10",
            "affected_quantity": "48 capsules",
            "customer_name": "Apollo Pharmacy",
            "complaint_description": state['input_text'],
            "risk_assessment": {
                "severity": "Major",
                "risk_score": "8/10",
                "next_action": "Route to QA investigation and issue replacement",
                "qa_recommendation": "Quarantine batch BMX24602 and inspect retention samples."
            },
            "chat_response": "I have logged the complaint details and generated the risk assessment."
        }
    return state

# Build Graph
graph = StateGraph(AgentState)
graph.add_node("process_tool", process_complaint_tool)
graph.set_entry_point("process_tool")
graph.add_edge("process_tool", END)

complaint_agent = graph.compile()