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


def validate_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    if not (url.startswith("http://") or url.startswith("https://")):
        return False
    parsed = urlparse(url)
    return bool(parsed.netloc and parsed.scheme)


def extract_projects_from_ts(ts_path: str) -> list:
    """Parse top-level project records from src/data/projects.ts PROJECTS array."""
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    match = re.search(r"export const PROJECTS:\s*ProjectItem\[\]\s*=\s*\[(.*?)\n\];", content, re.DOTALL)
    if not match:
        raise ValueError("Could not locate PROJECTS array in src/data/projects.ts")

    array_body = match.group(1)
    # Split top-level 2-space-indented objects cleanly
    blocks = re.split(r"\n  \},\n  \{", array_body.strip())
    projects = []

    for block in blocks:
        def extract_str(key: str) -> str:
            m = re.search(
                rf'^\s{{4}}{key}:\s*(?:\n\s+)?"((?:[^"\\]|\\.)*)"',
                block,
                re.MULTILINE,
            )
            return m.group(1) if m else ""

        def extract_list(key: str) -> list:
            m = re.search(rf'^\s{{4}}{key}:\s*\[(.*?)\]', block, re.MULTILINE | re.DOTALL)
            if not m:
                return []
            return re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(1))

        p_id = extract_str("id")
        title = extract_str("title")
        description = extract_str("shortDescription") or extract_str("longDescription")
        github_url = extract_str("githubUrl")
        live_url = extract_str("liveUrl")
        demo_url = extract_str("demoUrl")
        tags = extract_list("tags") or extract_list("techStack")

        if p_id or title:
            projects.append(
                {
                    "id": p_id,
                    "title": title,
                    "description": description,
                    "tags": tags,
                    "githubUrl": github_url,
                    "liveUrl": live_url,
                    "demoUrl": demo_url,
                }
            )

    return projects


def run_validation(
    projects_ts_path: str,
    github_json_path: str,
    metadata_path: str,
    firebase_config_path: str,
) -> bool:
    errors = []
    warnings = []

    if not os.path.isfile(projects_ts_path):
        errors.append(f"Authoritative project registry not found at: {projects_ts_path}")
        print(f"[ERROR] {errors[-1]}")
        return False

    try:
        projects = extract_projects_from_ts(projects_ts_path)
    except Exception as exc:
        errors.append(f"Failed to parse {projects_ts_path}: {exc}")
        print(f"[ERROR] {errors[-1]}")
        return False

    # 1. Project Validation
    seen_project_ids = set()
    duplicate_ids = 0
    broken_references = 0

    if len(projects) == 0:
        errors.append("Zero projects parsed from src/data/projects.ts")

    for idx, p in enumerate(projects):
        p_id = p.get("id")
        title = p.get("title") or f"Index {idx}"

        for field in REQUIRED_PROJECT_FIELDS:
            val = p.get(field)
            if val is None or (isinstance(val, str) and not val.strip()):
                errors.append(f"Project '{title}' missing required field: '{field}'")
            elif isinstance(val, list) and len(val) == 0:
                warnings.append(f"Project '{title}' has empty array for '{field}'")

        if p_id:
            if p_id in seen_project_ids:
                errors.append(f"Duplicate project ID found: '{p_id}'")
                duplicate_ids += 1
            seen_project_ids.add(p_id)
        else:
            errors.append(f"Project at index {idx} has no 'id' field")

        title_lower = title.lower()
        desc_lower = p.get("description", "").lower()
        for forbidden in FORBIDDEN_PROJECT_TERMS:
            if forbidden in title_lower or forbidden in desc_lower:
                errors.append(f"Prohibited obsolete project detected: '{title}' matches '{forbidden}'")
                broken_references += 1

        for url_field in ["githubUrl", "liveUrl", "demoUrl"]:
            u = p.get(url_field)
            if u and not validate_url(u):
                errors.append(f"Project '{title}' has malformed URL in '{url_field}': '{u}'")
                broken_references += 1

    # 2. GitHub Telemetry Validation
    repo_count = 0
    if not os.path.isfile(github_json_path):
        warnings.append(f"GitHub snapshot missing at {github_json_path}")
    else:
        with open(github_json_path, "r", encoding="utf-8") as f:
            try:
                gh = json.load(f)
                repos = gh.get("repositories", [])
                repo_count = len(repos)
                if not repos:
                    warnings.append("public/data/github.json has empty repositories list")
                for repo in repos:
                    url = repo.get("html_url") or repo.get("url")
                    if url and not validate_url(url):
                        errors.append(f"GitHub repository '{repo.get('name')}' has malformed URL: '{url}'")
                        broken_references += 1
            except json.JSONDecodeError as exc:
                errors.append(f"Invalid JSON syntax in {github_json_path}: {exc}")

    # 3. Metadata & Firebase Config validation
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
    else:
        errors.append("metadata.json not found")

    if os.path.isfile(firebase_config_path):
        with open(firebase_config_path, "r", encoding="utf-8") as f:
            try:
                fb = json.load(f)
                if not fb.get("projectId") or not fb.get("apiKey"):
                    errors.append("firebase-applet-config.json missing projectId or apiKey")
            except json.JSONDecodeError:
                errors.append("firebase-applet-config.json is not valid JSON")
    else:
        errors.append("firebase-applet-config.json not found")

    # Output structured report
    print("Portfolio Data Validation")
    print("-------------------------")
    print(f"Projects verified (TS registry): {len(projects)}")
    print(f"GitHub repositories synced: {repo_count}")
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
    projects_ts_file = os.path.join(base_dir, "src", "data", "projects.ts")
    github_json_file = os.path.join(base_dir, "public", "data", "github.json")
    meta_file = os.path.join(base_dir, "metadata.json")
    firebase_file = os.path.join(base_dir, "firebase-applet-config.json")

    success = run_validation(projects_ts_file, github_json_file, meta_file, firebase_file)
    sys.exit(0 if success else 1)
