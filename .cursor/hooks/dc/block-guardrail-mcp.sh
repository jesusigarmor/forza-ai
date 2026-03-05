#!/usr/bin/env bash
# =============================================================================
# block-guardrail-mcp.sh — Cursor beforeMCPExecution hook
# =============================================================================
# Blocks MCP tool calls that reference hidden guardrail files in their inputs.
# Closes the gap where MCP servers (Serena, firecrawl, etc.) bypass
# .cursorignore and beforeShellExecution by operating via LSP/HTTP.
#
# Input (stdin): { "server": "...", "tool_name": "...", "tool_input": "..." }
# Output: { "permission": "allow" } or { "permission": "deny", ... }
# =============================================================================

set -euo pipefail

INPUT=$(cat)

MANIFEST="${0%/*}/../../scripts/setup/guardrail-manifest.sh"
if [[ -f "$MANIFEST" ]]; then
  # shellcheck source=../../scripts/setup/guardrail-manifest.sh
  source "$MANIFEST"
  if [[ -z "${GUARDRAIL_PATTERNS+x}" ]] || [[ ${#GUARDRAIL_PATTERNS[@]} -eq 0 ]]; then
    echo '{"permission":"deny","agent_message":"BLOCKED: Guardrail manifest failed to load — failing closed","user_message":"Guardrail manifest load failure"}'
    exit 0
  fi
else
  echo '{"permission":"allow"}'
  exit 0
fi

TOOL_INPUT=$(echo "$INPUT" | jq -r '.tool_input // empty' 2>/dev/null)
[[ -z "$TOOL_INPUT" ]] && { echo '{"permission":"allow"}'; exit 0; }

# Extract file-path fields from tool_input. Only these are checked against
# guardrail patterns — NOT free-text fields like replyText, prompt, content,
# description, etc. This prevents false positives on MCP calls that merely
# mention guardrail filenames in their text (e.g., PR replies about guardrails).
PATH_FIELDS=$(echo "$TOOL_INPUT" | jq -r '
  [.relative_path, .file_path, .path, .cwd,
   (.edits // [] | .[].file_path // empty)]
  | map(select(. != null and . != ""))
  | .[]' 2>/dev/null)

# If no path fields found, allow (non-file MCP calls like search, PR comments, etc.)
[[ -z "$PATH_FIELDS" ]] && { echo '{"permission":"allow"}'; exit 0; }

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
WRITE_TOOLS="replace_symbol_body|insert_before_symbol|insert_after_symbol|rename_symbol|replace_content|create_text_file|replace_lines|delete_lines|insert_at_line"

# shellcheck disable=SC2154
for pattern in "${GUARDRAIL_PATTERNS[@]}"; do
  if echo "$PATH_FIELDS" | grep -qi "$pattern"; then
    if echo "$TOOL_NAME" | grep -qiE "$WRITE_TOOLS"; then
      echo "{\"permission\":\"deny\",\"agent_message\":\"BLOCKED: MCP write tool references guardrail file (matched: $pattern).\",\"user_message\":\"Blocked MCP write to guardrail file\"}"
    else
      echo "{\"permission\":\"deny\",\"agent_message\":\"BLOCKED: MCP tool references guardrail file (matched: $pattern).\",\"user_message\":\"Blocked MCP access to guardrail file\"}"
    fi
    exit 0
  fi
done

echo '{"permission":"allow"}'
exit 0