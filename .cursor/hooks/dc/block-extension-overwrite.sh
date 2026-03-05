#!/bin/bash
# Block shell commands that write to ~/.cursor/extensions/local.dc
# That path is a symlink to source during development. Writing through it
# destroys source code with minified build artifacts.
# Use `yarn test-consumer-install` instead.
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: Writing to ~/.cursor/extensions/local.dc via shell is prohibited. That path is a symlink to source — writing through it destroys source files. Use `yarn test-consumer-install` which safely unlinks the symlink first.",
  "user_message": "Blocked write to extension dir (symlink to source). Use: yarn test-consumer-install"
}
EOF
