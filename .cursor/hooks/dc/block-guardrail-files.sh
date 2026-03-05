#!/bin/bash
# Block ALL shell access to enforcement/guardrail config files.
# These files are in .cursorignore but Shell bypasses that.
# Protected: .oxlintrc.json, .oxfmtrc.json, tsconfig*.json,
#            lint-plugins/, .editorconfig, .gitattributes, ci.yml
cat > /dev/null
cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "Blocked: this command references a guardrail config file protected by .cursorignore. You are NEVER allowed to read, write, copy, move, or reference these files via Shell: .oxlintrc.json, .oxfmtrc.json, tsconfig.json (all variants), lint-plugins/, .editorconfig, .gitattributes, .github/workflows/ci.yml. These files constrain AI-generated code and are human-only. Do NOT retry, do NOT attempt alternative commands.",
  "user_message": "Blocked agent shell access to guardrail config file"
}
EOF
