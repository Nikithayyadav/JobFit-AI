import re

# Extract Candidate Details

def extract_candidate_details(text):

    details = {

        "name": "",
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": ""
    }

    lines = text.split("\n")

    # NAME (first non-empty line)

    for line in lines:

        clean = line.strip()

        if clean:

            details["name"] = clean.title()

            break

    # EMAIL

    email_match = re.search(

        r'[\w\.-]+@[\w\.-]+',

        text
    )

    if email_match:

        details["email"] = email_match.group()

    # PHONE

    phone_match = re.search(

        r'(\+91[-\s]?)?[6-9]\d{9}',

        text
    )

    if phone_match:

        details["phone"] = phone_match.group()

    # LINKEDIN

    linkedin_match = re.search(

        r'linkedin\.com/in/[A-Za-z0-9_-]+',

        text
    )

    if linkedin_match:

        details["linkedin"] = linkedin_match.group()

    # GITHUB

    github_match = re.search(

        r'github\.com/[A-Za-z0-9_-]+',

        text
    )

    if github_match:

        details["github"] = github_match.group()

    return details