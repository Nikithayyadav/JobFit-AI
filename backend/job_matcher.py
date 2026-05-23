def calculate_job_match(skills, job_description):

    job_description = job_description.lower()

    matched_skills = []

    missing_skills = []

    for skill in skills:

        if skill.lower() in job_description:
            matched_skills.append(skill)

    common_skills = [
        "python",
        "react",
        "sql",
        "machine learning",
        "nlp",
        "fastapi",
        "docker",
        "aws",
        "javascript",
        "git"
    ]

    for skill in common_skills:

        if skill in job_description and skill not in skills:
            missing_skills.append(skill)

    total_required = len(common_skills)

    match_score = int((len(matched_skills) / total_required) * 100)

    if match_score > 100:
        match_score = 100

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }