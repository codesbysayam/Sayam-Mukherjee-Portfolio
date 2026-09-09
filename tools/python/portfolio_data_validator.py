#!/usr/bin/env python3
"""
Portfolio Data Validator
------------------------
Validates structured portfolio data, project relationships, skill taxonomies,
and external link formats before build and deployment.
"""

import json
import os
import re
import sys
from urllib.parse import urlparse

FORBIDDEN_PROJECT_TERMS = [
    "fitness os pro",
    "finance os pro",
    "obsidian optics",
]

REQUIRED_PROJECT_FIELDS = ["id", "title", "description", "tags"]
URL_REGEX = re.compile(
    r"^(?:http|ftp)s?://"  # http:// or https://
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|"  # domain...
    r"localhost|"  # localhost...
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
    r"(?::\d+)?"  # optional port
    r"(?:/?|[/?]\S+)$", re.IGNORECASE
)

def validate_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    if not (url.startswith("http://") or url.startswith("https://")):
        return False
    parsed = urlparse(url)
    return bool(parsed.netloc and parsed.scheme)

def run_validation(data_path: str, metadata_path: str) -> bool:
    errors = []
    warnings = []
    
    if not os.path.isfile(data_path):
        errors.append(f"Data file not found at: {data_path}")
        return False

    with open(data_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON syntax in {data_path}: {exc}")
            return False

    projects = data.get("projects", [])
    skills = data.get("skills", [])
    experience = data.get("experience", [])
    
    # 1. Project Validation
    seen_project_ids = set()
    duplicate_ids = 0
    broken_references = 0
    
    for idx, p in enumerate(projects):
        p_id = p.get("id")
        title = p.get("title", f"Index {idx}")

        # Check required fields
        for field in REQUIRED_PROJECT_FIELDS:
            val = p.get(field)
            if val is None or (isinstance(val, str) and not val.strip()):
                errors.append(f"Project '{title}' missing required field: '{field}'")
            elif isinstance(val, list) and len(val) == 0:
                warnings.append(f"Project '{title}' has empty array for '{field}'")

        # Duplicate ID check
        if p_id:
            if p_id in seen_project_ids:
                errors.append(f"Duplicate project ID found: '{p_id}'")
                duplicate_ids += 1
            seen_project_ids.add(p_id)
        else:
            errors.append(f"Project at index {idx} has no 'id' field")

        # Prohibited obsolete projects check
        title_lower = title.lower()
        for forbidden in FORBIDDEN_PROJECT_TERMS:
            if forbidden in title_lower or forbidden in (p.get("description", "").lower()):
                errors.append(f"Prohibited obsolete project detected: '{title}' matches '{forbidden}'")
                broken_references += 1

        # URL validations
        for url_field in ["githubUrl", "liveUrl", "demoUrl"]:
            u = p.get(url_field)
            if u:
                if not validate_url(u):
                    errors.append(f"Project '{title}' has malformed URL in '{url_field}': '{u}'")
                    broken_references += 1

    # 2. Skills Validation
    skill_names = set()
    for s in skills:
        if isinstance(s, dict) and "skills" in s and isinstance(s["skills"], list):
            cat_name = s.get("category", "Unnamed Category")
            for sub_s in s["skills"]:
                s_name = sub_s.get("name") if isinstance(sub_s, dict) else str(sub_s)
                if not s_name or not str(s_name).strip():
                    errors.append(f"Encountered empty skill in category '{cat_name}'")
                else:
                    skill_names.add(str(s_name).strip())
        else:
            name = s.get("name") if isinstance(s, dict) else str(s)
            if not name or not str(name).strip():
                errors.append("Encountered empty skill entry")
            else:
                skill_names.add(str(name).strip())

    # 3. Metadata validation
    if os.path.isfile(metadata_path):
        with open(metadata_path, "r", encoding="utf-8") as f:
            try:
                meta = json.load(f)
                if not meta.get("name"):
                    errors.append("metadata.json missing 'name' attribute")
                if not meta.get("description"):
                    errors.append("metadata.json missing 'description' attribute")
            except json.JSONDecodeError:
                errors.append("metadata.json is not valid JSON")

    # Output structured report
    print("Portfolio Data Validation")
    print("-------------------------")
    print(f"Projects checked: {len(projects)}")
    print(f"Skills verified: {len(skills) if skills else len(skill_names)}")
    print(f"Experience entries: {len(experience)}")
    print(f"Duplicate IDs: {duplicate_ids}")
    print(f"Broken references: {broken_references}")
    print(f"Total warnings: {len(warnings)}")
    print(f"Total errors: {len(errors)}")
    
    if warnings:
        print("\nWarnings:")
        for w in warnings:
            print(f"  [WARN] {w}")

    if errors:
        print("\nValidation Errors:")
        for e in errors:
            print(f"  [ERROR] {e}")
        print("\nValidation: FAIL")
        return False

    print("Validation: PASS")
    return True

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    store_file = os.path.join(base_dir, "data_store.json")
    meta_file = os.path.join(base_dir, "metadata.json")
    
    success = run_validation(store_file, meta_file)
    sys.exit(0 if success else 1)
