def analyze_resume(skills, ats_score):

    total_skills = len(skills)

    level = ""

    category = ""

    recommendations = []

    # Resume Level

    if ats_score >= 80:
        level = "Advanced"
    elif ats_score >= 60:
        level = "Intermediate"
    else:
        level = "Beginner"

    # Domain Detection

    if "machine learning" in skills or "nlp" in skills:
        category = "AI / Machine Learning"

    elif "react" in skills or "javascript" in skills:
        category = "Frontend Development"

    elif "sql" in skills:
        category = "Backend / Database"

    else:
        category = "General Software"

    # Recommendations

    if "github" not in skills:
        recommendations.append("Add GitHub projects.")

    if "react" not in skills:
        recommendations.append("Learn frontend development.")

    if "sql" not in skills:
        recommendations.append("Improve database skills.")

    if total_skills < 8:
        recommendations.append("Add more technical skills.")

    return {
        "total_skills": total_skills,
        "level": level,
        "category": category,
        "recommendations": recommendations
    }