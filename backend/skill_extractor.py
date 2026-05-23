SKILLS_DB = [

    "python",
    "java",
    "c",
    "c++",
    "javascript",
    "html",
    "css",
    "react",
    "node.js",
    "fastapi",
    "flask",
    "sql",
    "mongodb",
    "machine learning",
    "deep learning",
    "nlp",
    "computer vision",
    "tensorflow",
    "pytorch",
    "opencv",
    "git",
    "github",
    "docker",
    "aws",
    "streamlit"

]

def extract_skills(text):

    text = text.lower()

    detected_skills = []

    for skill in SKILLS_DB:

        if skill.lower() in text:
            detected_skills.append(skill)

    return list(set(detected_skills))