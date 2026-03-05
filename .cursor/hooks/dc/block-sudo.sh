#!/bin/bash
# Block sudo - no elevated privileges needed in dev workflow
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: sudo is prohibited. No elevated privileges should be needed in normal development.",
  "user_message": "Blocked sudo - no elevated privileges allowed"
}
EOF
