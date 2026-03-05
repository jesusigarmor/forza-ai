#!/bin/bash
# Block recursive rm (rm -r, rm -rf, rm -fr, etc.) to prevent agents from
# wiping directory trees. Single-file rm is allowed -- recoverable via git.
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "Blocked: recursive rm is prohibited. You may delete individual files with rm (no -r flag) or the Delete tool, but you cannot recursively delete directories. If you need a directory removed, tell the human.",
  "user_message": "Blocked recursive rm command"
}
EOF
