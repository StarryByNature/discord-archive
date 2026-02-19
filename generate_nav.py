import os
import re

DOCS_DIR = "docs"
OUTPUT_FILE = "mkdocs.yml"

# Folder name you want hidden from navigation
HIDE_TOP_FOLDER = "useless lesbians"


def clean_title(name):
    # remove .html
    name = os.path.splitext(name)[0]

    # remove Discord IDs like [123456789]
    name = re.sub(r"\s*\[\d+\]", "", name)

    # prettier spacing
    name = name.replace("_", " ")

    return name.strip()


def build_nav():
    nav_lines = [
        "site_name: Discord Archive",
        "theme:",
        "  name: material",
        "",
        "nav:"
    ]

    for root, _, files in os.walk(DOCS_DIR):
        html_files = sorted(f for f in files if f.lower().endswith(".html"))

        if not html_files:
            continue

        rel_dir = os.path.relpath(root, DOCS_DIR)

        # Hide top folder name
        if rel_dir.startswith(HIDE_TOP_FOLDER):
            rel_dir = rel_dir[len(HIDE_TOP_FOLDER):].lstrip("\\/")

        section_name = rel_dir.replace("_", " ").title()

        if rel_dir == "." or rel_dir == "":
            for f in html_files:
                title = clean_title(f)
                nav_lines.append(f"  - {title}: {f}")
        else:
            nav_lines.append(f"  - {section_name}:")
            for f in html_files:
                title = clean_title(f)
                path = os.path.join(root, f)
                path = os.path.relpath(path, DOCS_DIR).replace("\\", "/")
                nav_lines.append(f"      - {title}: {path}")

    return "\n".join(nav_lines)


with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(build_nav())

print("mkdocs.yml generated!")

