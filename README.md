# AI-Powered Quality Management System (AIVOA QMS)
### Customer Complaint Management for Pharmaceutical Manufacturing (API / FDF)

AIVOA QMS is an enterprise-grade customer complaint management system designed for pharmaceutical manufacturing (Active Pharmaceutical Ingredients & Finished Dosage Forms). It features an interactive dual-pane interface combining a **Log Complaint Form** on the left and an **AI Assistant Co-pilot** on the right, powered by LangGraph and Groq LLMs (`llama-3.3-70b-versatile`).

---

## Key Features

* **Interactive Dual-Pane Dashboard**: Synchronized state management between manual form inputs and AI agent actions.
* **AI Agent Orchestration**: Natural language understanding for parsing customer complaints, auto-filling form parameters, and field updates.
* **Automated Risk & Severity Assessment**: Evaluates complaint text against pharmaceutical quality standards to automatically assign severity levels (Critical, Major, Minor) and recommend immediate QA next steps.
* **Document Data Extraction**: Upload PDF/Email complaint documents to extract structured metadata (Product Name, Batch Number, Manufacturing Date, Complainant Info).
* **State Preservation**: Intelligently updates individual fields without overwriting user-entered data.

---

## System Architecture & Tech Stack

```text
+-----------------------------------------------------------------------+
|                            React Frontend                             |
|              (Redux Toolkit, Vite, Tailwind CSS, Lucide)              |
+-----------------------------------+-----------------------------------+
                                    |
                                    | REST API / JSON
                                    v
+-----------------------------------------------------------------------+
|                            FastAPI Backend                            |
|                 (Python 3.11+, SQLAlchemy, Pydantic)                  |
+-----------------------------------+-----------------------------------+
                                    |
                  +-----------------+-----------------+
                  |                                   |
                  v                                   v
+-----------------------------------+   +-------------------------------+
|      LangGraph AI Orchestrator    |   |      PostgreSQL Database      |
|     (Groq: Llama 3.3 70B)         |   |    (Containerized via Docker) |
+-----------------------------------+   +-------------------------------+
```
## Tech Stack

Frontend: React 18, Redux Toolkit, Vite, Tailwind CSS v3, Lucide React

Backend: Python 3.11+, FastAPI, SQLAlchemy, python-multipart

AI Orchestration: LangGraph, LangChain, Groq API (llama-3.3-70b-versatile)

Database: PostgreSQL (Docker Containerized)

## Directory Structure
```
aivoa-qms-complaints/
├── docker-compose.yml
├── README.md
├── .gitignore
├── backend/
│   ├── main.py
│   ├── agent.py               # LangGraph state graph & LLM tools
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        └── complaintsSlice.js # Redux state management
```

## Getting Started

Prerequisites
Node.js: v18 or higher

Python: v3.10 or higher

Docker & Docker Compose: Installed and running

Groq API Key: Obtainable from Groq Console

Step 1: Clone & Configure Repository

```
git clone [https://github.com/YOUR_GITHUB_USERNAME/aivoa-qms-complaints.git](https://github.com/YOUR_GITHUB_USERNAME/aivoa-qms-complaints.git)
cd aivoa-qms-complaints
```

Step 2: Database Setup (PostgreSQL)
Start the PostgreSQL database container:

```
docker-compose up -d
```

Verify that the database container is active:
```
docker ps
```

Step 3: Backend Setup (FastAPI & LangGraph)
Open a terminal and navigate to the backend/ directory:

```
cd backend
```

Create and activate a Python virtual environment:

```
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install requirements:

```
pip install -r requirements.txt
```

Create a .env file in the backend/ root directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/qms_db
GROQ_API_KEY=your_actual_groq_api_key_here
```

Launch the FastAPI backend server:

```
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend server will run at http://localhost:8000 with Swagger documentation accessible at http://localhost:8000/docs.


Step 4: Frontend Setup (React + Vite)
Open a new terminal and navigate to the frontend/ directory:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start the Vite development server:

```
npm run dev
```

Open your browser and navigate to http://localhost:5173.


## Usage & Testing Prompts

Once the application is running, test the AI Co-pilot assistant using these professional, GMP-compliant customer complaint scenarios covering the full feature suite:

Test Scenario 1: Initial Complaint Log & Automated Risk Assessment (Critical Defect)
Paste into the AI Co-pilot Chat:

"Urgent notice from St. Jude Children's Hospital: Dr. Aris Thorne reported dark particulate matter suspended inside an intact vial of Ondansetron 2mg/mL Injection. Product Lot Number: ON88392, Expiration Date: 11/2026. A total of 15 vials in the current shipment showed visible foreign particles. Customer contact: athorne@stjude-health.org, Phone: 555-019-2831. Please parse this and update the form."

Expected Outcome: Auto-fills product details, batch number, complainant information, marks severity as Critical, and triggers an automated risk assessment recommending immediate batch quarantine and QA investigation.

Test Scenario 2: Conversational Field Modification & Context Preservation (Partial Update)
Paste into the AI Co-pilot Chat:

"Correction regarding the previous entry: Dr. Thorne updated the affected quantity to 24 vials instead of 15, and clarified that the packaging type is 10 mL Type I Clear Glass Vials."

Expected Outcome: Intelligently updates only the Affected Quantity and Packaging Type fields without clearing or overwriting existing fields (e.g., Complainant, Lot Number, or Risk Level).

Test Scenario 3: Secondary Defect Class (Major Labeling & Packaging Issue)
Paste into the AI Co-pilot Chat:

"Complaint received from Apex Care Pharmacy: Pharmacist Sarah Lin (slin@apexcare.com) reported a labeling discrepancy with Metformin HCl 500mg ER Tablets (Batch # MF-2025-08B). The secondary carton states 500mg, but the primary blister foil backing is misprinted as 1000mg. 100 cartons affected. Contact: 555-882-1049."

Expected Outcome: Updates form state with new complaint parameters, categorizes complaint as Packaging/Labeling Misbrand, and assigns a Major severity rating with mandatory label reconciliation action steps.

Test Scenario 4: Automated Document Parsing & Extraction (PDF / TXT Upload)
Click the Document PDF button in the AI Co-pilot chat panel and upload a sample formal customer complaint letter, email PDF, or inspection report (PDF/TXT):

Expected Outcome: The AI parses structured metadata (Complainant Name, Facility, Product Name, API/FDF designation, Manufacturing Date, Batch Number, Description of Defect) directly out of the document text and populates both the Log Complaint Form and the Risk Assessment Engine.


# Application Screenshot

The screenshot below shows the complete AIVOA QMS interface with the Complaint Form and AI Co-pilot working together.

![AIVOA QMS Working UI](assets/screenshots/AIVOA-Pharma-QMS-Complaint-System-UI.png)

![AIVOA QMS Demo](assets/AwesomeScreenshot-23_7_2026,10_03_11pm.mp4)

