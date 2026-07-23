from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ComplaintCreate(BaseModel):
    raw_text: str

class ComplaintResponse(BaseModel):
    id: str
    complaint_number: str
    raw_text: str
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    defect_category: Optional[str] = None
    completeness_score: int
    missing_fields: List[str]
    risk_severity: str
    root_cause: Optional[str] = None
    capa_recommendation: Optional[str] = None
    is_duplicate: bool
    summary: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True