def calculate_ats_score(skills):

    score = 0

    feedback = []

    # Skill-based scoring

    if len(skills) >= 10:
        score += 40
    elif len(skills) >= 5:
        score += 25
    else:
        score += 10
        feedback.append("Add more technical skills.")

    # Important skill checks

    important_skills = [
        "python",
        "sql",
        "machine learning",
        "react",
        "git"
    ]

    matched = 0

    for skill in important_skills:

        if skill in skills:
            matched += 1

    score += matched * 10

    # Bonus

    if "deep learning" in skills:
        score += 5

    if "nlp" in skills:
        score += 5

    # Cap score

    if score > 100:
        score = 100

    # Feedback

    if score >= 80:
        feedback.append("Excellent resume for ATS systems.")
    elif score >= 60:
        feedback.append("Good resume but can be improved.")
    else:
        feedback.append("Resume needs optimization for ATS.")

    return score, feedback