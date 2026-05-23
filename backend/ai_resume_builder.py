from openai import OpenAI
from dotenv import load_dotenv

import os
import json

# Load Environment Variables

load_dotenv()

# OpenRouter Client

client = OpenAI(

    base_url="https://openrouter.ai/api/v1",

    api_key=os.getenv("OPENROUTER_API_KEY")
)

# AI Resume Optimizer

def optimize_resume(resume_text, job_description):

    try:

        prompt = f"""
You are an expert ATS resume optimizer and technical recruiter.

Your task:
Optimize the candidate's resume according to the provided job description.

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT return markdown
- Do NOT add explanations
- Do NOT change candidate identity
- Do NOT invent fake experience
- Keep all information realistic
- Keep resume concise
- Keep resume one-page friendly
- Add ATS-friendly keywords naturally
- Improve technical wording
- Improve project descriptions
- Improve professional summary
- Keep strongest projects only
- Keep strongest experience only
- Use concise bullet points
- Maximum 2 bullet points per section

STRICT JSON FORMAT:

{{
  "name": "",
  "contact": "",
  "summary": "",
  "skills": [],
  "experience": [
    {{
      "company": "",
      "role": "",
      "duration": "",
      "points": []
    }}
  ],
  "projects": [
    {{
      "name": "",
      "points": []
    }}
  ],
  "education": [],
  "certifications": [],
  "achievements": []
}}

JOB DESCRIPTION:
{job_description}

ORIGINAL RESUME:
{resume_text}
"""

        # AI Completion

        completion = client.chat.completions.create(

            model="openai/gpt-3.5-turbo",

            messages=[

                {
                    "role": "system",

                    "content": (
                        "You are a professional ATS resume optimization engine. "
                        "Always return strict valid JSON only."
                    )
                },

                {
                    "role": "user",

                    "content": prompt
                }
            ],

            temperature=0.3,

            max_tokens=1800
        )

        # Extract Response

        response = completion.choices[0].message.content

        # Clean JSON Response

        response = response.strip()

        response = response.replace("```json", "")
        response = response.replace("```", "")

        # Convert JSON String → Python Dictionary

        parsed_json = json.loads(response)

        # Safe Defaults

        parsed_json.setdefault("name", "")
        parsed_json.setdefault("contact", "")
        parsed_json.setdefault("summary", "")
        parsed_json.setdefault("skills", [])
        parsed_json.setdefault("experience", [])
        parsed_json.setdefault("projects", [])
        parsed_json.setdefault("education", [])
        parsed_json.setdefault("certifications", [])
        parsed_json.setdefault("achievements", [])

        return parsed_json

    except Exception as e:

        print("AI Resume Builder Error:", e)

        # Safe Fallback Response

        return {

            "name": "",

            "contact": "",

            "summary": (
                "Unable to optimize resume currently. "
                "Please try again later."
            ),

            "skills": [],

            "experience": [],

            "projects": [],

            "education": [],

            "certifications": [],

            "achievements": []
        }