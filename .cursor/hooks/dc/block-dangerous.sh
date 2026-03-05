#!/bin/bash
# Block extremely dangerous commands - dd, shutdown, reboot
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: This is an extremely dangerous system command. Absolutely prohibited.",
  "user_message": "Blocked dangerous system command"
}
EOF
