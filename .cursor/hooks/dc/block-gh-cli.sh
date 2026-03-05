#!/bin/bash
# Block direct gh CLI usage -- agents must use the pr-workflow MCP instead.
# The MCP handles pagination, rate limiting, and response formatting.
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "Blocked: direct gh CLI usage is prohibited. Use the pr-workflow MCP server instead (get_pr_feedback, get_ci_failure_logs, reply_to_pr_comment, resolve_pr_comment, etc.). The MCP handles pagination, response formatting, and rate limiting automatically. Do NOT retry with gh commands.",
  "user_message": "Blocked agent gh CLI access — use pr-workflow MCP"
}
EOF