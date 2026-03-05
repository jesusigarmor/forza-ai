#!/bin/bash
# Block ALL git write commands from the agent — unconditionally.
# The agent must NEVER run git add, commit, push, reset, checkout, etc.
# The user commits manually from their own terminal.

cat > /dev/null  # Consume stdin

cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: You are NEVER allowed to run git write commands (add, commit, push, reset, checkout, stash, branch -d). The user will handle all git operations manually. Do NOT attempt to retry or work around this.",
  "user_message": "Blocked agent git write command"
}
EOF