#!/usr/bin/env bash
# ==============================================================================
# setup-git-hooks.sh - Installs Gerrit Change-Id commit hook
# ==============================================================================

set -eu

HOOK_DIR="$(git rev-parse --git-dir)/hooks"
HOOK_FILE="$HOOK_DIR/commit-msg"

if [[ ! -d "$HOOK_DIR" ]]; then
  echo "Error: Not a git repository."
  exit 1
fi

echo "Installing Gerrit commit-msg hook into $HOOK_FILE..."
curl -Lo "$HOOK_FILE" "https://gerrit-review.googlesource.com/tools/hooks/commit-msg" 2>/dev/null || {
  echo "Warning: Could not fetch from gerrit-review online. Generating local fallback hook."
  cat << 'EOF' > "$HOOK_FILE"
#!/bin/sh
# Fallback local commit-msg hook
if ! grep -q '^Change-Id:' "$1"; then
  MSG_HASH=$(git log -1 --pretty=format:"%H" 2>/dev/null || date +%s)
  echo "" >> "$1"
  echo "Change-Id: I$(echo "$MSG_HASH" | shasum | awk '{print $1}')" >> "$1"
fi
EOF
}

chmod +x "$HOOK_FILE"
echo "Done! Future commits will automatically generate a Gerrit Change-Id."
