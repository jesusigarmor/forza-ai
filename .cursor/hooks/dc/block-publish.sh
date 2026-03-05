#!/bin/bash
# Block npm publish / yarn publish - prevent accidental package publishing
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: Publishing packages is prohibited. This must be done manually through proper release process.",
  "user_message": "Blocked publish command - packages must be published manually"
}
EOF
