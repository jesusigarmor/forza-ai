#!/bin/bash
# Block kill/killall/pkill - could terminate important processes
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: kill/killall/pkill is prohibited. Do not terminate processes.",
  "user_message": "Blocked kill command - cannot terminate processes"
}
EOF
