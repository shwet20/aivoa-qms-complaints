import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, Boolean
from datetime import datetime
from database import Base

class ComplaintModel(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_number = Column(String, unique=True, index=True)
    raw_text = Column(Text, nullable=False)
    
    customer_name = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    batch_number = Column(String, nullable=True)
    defect_category = Column(String, nullable=True)
    
    completeness_score = Column(Integer, default=0)
    missing_fields = Column(JSON, default=list)
    risk_severity = Column(String, default="Minor")
    root_cause = Column(Text, nullable=True)
    capa_recommendation = Column(Text, nullable=True)
    is_duplicate = Column(Boolean, default=False)
    summary = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)