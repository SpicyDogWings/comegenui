#!/bin/bash

# Fetch GitLab issue and save as markdown in gitlab/issues-${id}.md
# Usage: ./fetch-gitlab-issue.sh <issue_id>

set -euo pipefail

# Check if ID is provided
if [ $# -eq 0 ]; then
  read -p "Enter issue ID: " ISSUE_ID
else
  ISSUE_ID="$1"
fi

# Load config from scripts/configs/gitlab.config
CONFIG_FILE="$(dirname "$0")/configs/gitlab.config"
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Config file not found at $CONFIG_FILE"
  exit 1
fi

source "$CONFIG_FILE"

# API URL
API_URL="${BASE_URL}/projects/${PROJECT_ID}/issues/${ISSUE_ID}"

# Output file
OUTPUT_DIR="$(dirname "$0")/../gitlab"
OUTPUT_FILE="${OUTPUT_DIR}/issues-${ISSUE_ID}.md"

# Create gitlab directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Fetch issue data
RESPONSE=$(curl -s -H "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "$API_URL")

# Check for errors
if echo "$RESPONSE" | jq -e '.message' >/dev/null 2>&1; then
  ERROR_MSG=$(echo "$RESPONSE" | jq -r '.message')
  echo "Error fetching issue: $ERROR_MSG"
  exit 1
fi

# Extract fields
TITLE=$(echo "$RESPONSE" | jq -r '.title')
DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // ""')
AUTHOR=$(echo "$RESPONSE" | jq -r '.author.username // ""')
CREATED_AT=$(echo "$RESPONSE" | jq -r '.created_at')
UPDATED_AT=$(echo "$RESPONSE" | jq -r '.updated_at')
STATE=$(echo "$RESPONSE" | jq -r '.state')
LABELS=$(echo "$RESPONSE" | jq -r '[.labels[]] | join(", ") // ""')
MILESTONE=$(echo "$RESPONSE" | jq -r '.milestone.title // ""')
ASSIGNEE=$(echo "$RESPONSE" | jq -r '.assignee.username // ""')
PRIORITY=$(echo "$RESPONSE" | jq -r '.priority // ""')
WEIGHT=$(echo "$RESPONSE" | jq -r '.weight // ""')
DUE_DATE=$(echo "$RESPONSE" | jq -r '.due_date // ""')

# Build markdown
cat > "$OUTPUT_FILE" <<EOF
# Issue #${ISSUE_ID}: ${TITLE}

## Metadata

| Field | Value |
|-------|-------|
| **ID** | #${ISSUE_ID} |
| **Author** | @${AUTHOR} |
| **State** | ${STATE} |
| **Created** | ${CREATED_AT} |
| **Updated** | ${UPDATED_AT} |
| **Assignee** | ${ASSIGNEE} |
| **Milestone** | ${MILESTONE} |
| **Priority** | ${PRIORITY} |
| **Weight** | ${WEIGHT} |
| **Due Date** | ${DUE_DATE} |
| **Labels** | ${LABELS} |

---

## Description

${DESCRIPTION}

---

*Generated: $(date)*
EOF

echo "Saved: $OUTPUT_FILE"
