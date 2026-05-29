import os
import json
import pdfplumber
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ReportLab Imports
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# Custom Modules
from skill_extractor import extract_skills
from ats_scorer import calculate_ats_score
from resume_analyzer import analyze_resume
from job_matcher import calculate_job_match
from ai_resume_builder import optimize_resume
from resume_parser import extract_candidate_details

# 1. INITIALIZE APP ONCE
app = FastAPI()

# 2. CONFIGURE CORS ONCE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use cloud-safe temporary storage directory for deployments
UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Static Files
app.mount(f"/{UPLOAD_DIR}", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Home Route
@app.get("/")
def home():
    return {"message": "JobFit AI Backend Running"}


# Generate Professional Resume PDF
def generate_resume_pdf(data, filename):
    pdf_path = f"{UPLOAD_DIR}/{filename}.pdf"

    doc = SimpleDocTemplate(
        pdf_path,
        rightMargin=35,
        leftMargin=35,
        topMargin=18,
        bottomMargin=12
    )

    styles = getSampleStyleSheet()
    elements = []

    # Styles
    heading_style = styles["Heading2"]
    body_style = styles["BodyText"]

    heading_style.fontSize = 14
    heading_style.textColor = colors.HexColor("#1e3a8a")

    body_style.fontSize = 10
    body_style.leading = 12

    # NAME
    elements.append(
        Paragraph(
            f"<font size=24 color='#0f172a'><b>{data.get('name', '')}</b></font>",
            styles["Title"]
        )
    )

    # Role Title
    elements.append(
        Paragraph(
            "<font color='#2563eb'><b>AI Engineer | Full Stack Developer</b></font>",
            body_style
        )
    )
    elements.append(Spacer(1, 5))

    # CONTACT
    elements.append(
        Paragraph(
            f"<font color='#475569'>{data.get('contact', '')}</font>",
            body_style
        )
    )
    elements.append(Spacer(1, 8))

    # SUMMARY
    elements.append(Paragraph("<b>SUMMARY</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph(data.get("summary", ""), body_style))
    elements.append(Spacer(1, 5))

    # SKILLS
    elements.append(Paragraph("<b>SKILLS</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))
    
    skills = ", ".join(data.get("skills", []))
    elements.append(Paragraph(skills, body_style))
    elements.append(Spacer(1, 5))

    # EXPERIENCE
    elements.append(Paragraph("<b>EXPERIENCE</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))

    for exp in data.get("experience", [])[:2]:
        title = f"{exp.get('company')} | {exp.get('role')} | {exp.get('duration')}"
        elements.append(Paragraph(f"<b>{title}</b>", body_style))
        for point in exp.get("points", []):
            elements.append(Paragraph(f"• {point}", body_style))
        elements.append(Spacer(1, 4))

    # PROJECTS
    elements.append(Paragraph("<b>PROJECTS</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))

    for proj in data.get("projects", [])[:2]:
        elements.append(Paragraph(f"<b>{proj.get('name')}</b>", body_style))
        for point in proj.get("points", []):
            elements.append(Paragraph(f"• {point}", body_style))
        elements.append(Spacer(1, 4))

    # EDUCATION
    elements.append(Paragraph("<b>EDUCATION</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))

    for edu in data.get("education", []):
        if isinstance(edu, dict):
            degree = edu.get("degree", "")
            institute = edu.get("institute", "")
            year = edu.get("year", "")
            cpi = edu.get("cpi", "")
            edu_text = f"{degree} | {institute} | {year}"
            if cpi:
                edu_text += f" | CGPA: {cpi}"
        else:
            edu_text = str(edu)
        elements.append(Paragraph(f"• {edu_text}", body_style))

    elements.append(Spacer(1, 5))

    # CERTIFICATIONS
    elements.append(Paragraph("<b>CERTIFICATIONS</b>", heading_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
    elements.append(Spacer(1, 4))

    for cert in data.get("certifications", [])[:2]:
        elements.append(Paragraph(f"• {cert}", body_style))

    # ACHIEVEMENTS
    achievements = data.get("achievements", [])
    if achievements:
        elements.append(Spacer(1, 5))
        elements.append(Paragraph("<b>ACHIEVEMENTS</b>", heading_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb")))
        elements.append(Spacer(1, 4))
        for achievement in achievements[:2]:
            elements.append(Paragraph(f"• {achievement}", body_style))

    # Build PDF
    doc.build(elements)
    return pdf_path


# Upload Resume API
@app.post("/upload-resume/")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Save Uploaded Resume safely to temporary file directory
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted_text = ""

    # Extract PDF Text
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                cleaned_text = text.replace("(cid:127)", "•")
                extracted_text += cleaned_text + "\n"

    # Extract Details & Scores
    candidate_details = extract_candidate_details(extracted_text)
    skills = extract_skills(extracted_text)
    ats_score, feedback = calculate_ats_score(skills)
    analysis = analyze_resume(skills, ats_score)
    job_match = calculate_job_match(skills, job_description)
    optimized_resume = optimize_resume(extracted_text, job_description)

    # Dynamic Candidate Info
    optimized_resume["name"] = candidate_details.get("name", "Candidate")
    optimized_resume["contact"] = (
        f"{candidate_details.get('phone', '')} | "
        f"{candidate_details.get('email', '')} | "
        f"{candidate_details.get('linkedin', '')} | "
        f"{candidate_details.get('github', '')}"
    )

    # Convert JSON for Frontend
    formatted_resume = json.dumps(optimized_resume, indent=2)

    # Generate PDF
    pdf_path = generate_resume_pdf(optimized_resume, "optimized_resume")

    # Response
    return {
        "filename": file.filename,
        "text": extracted_text[:3000],
        "skills": skills,
        "ats_score": ats_score,
        "feedback": feedback,
        "analysis": analysis,
        "job_match": job_match,
        "optimized_resume": formatted_resume,
        "pdf_download": pdf_path
    }


# Download Route
@app.get("/download-resume/")
def download_resume():
    file_path = f"{UPLOAD_DIR}/optimized_resume.pdf"
    if not os.path.exists(file_path):
        return {"error": "File not found. Please upload and optimize a resume first."}
        
    return FileResponse(
        path=file_path,
        filename="JobFitAI_Optimized_Resume.pdf",
        media_type="application/pdf"
    )