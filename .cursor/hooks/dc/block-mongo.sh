#!/bin/bash
# Block mongosh/mongo commands - use MongoDB MCP instead
#
# Use the mongodb MCP tools:
# - find: Query documents
# - aggregate: Run aggregation pipelines
# - count: Count documents
# - listCollections: List collections

cat > /dev/null

cat << 'EOF'
{
  "permission": "deny",
  "agent_message": "⛔ BLOCKED: mongosh/mongo CLI is prohibited. Use mongodb MCP instead:\n\n- mongodb.find for queries\n- mongodb.aggregate for pipelines\n- mongodb.count for counting\n- mongodb.listCollections for listing",
  "user_message": "Blocked mongo CLI - agent must use MongoDB MCP"
}
EOF
