#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/data/backups"
KEEP_N=${1:-7}

[ -d "$BACKUP_DIR" ] || exit 0
FILES=( $(ls -1t "$BACKUP_DIR"/sqlite.db.*.bak 2>/dev/null || true) )
TOTAL=${#FILES[@]}
if [ "$TOTAL" -le "$KEEP_N" ]; then
  echo "[prune] Nothing to prune (total=$TOTAL, keep=$KEEP_N)"
  exit 0
fi
TO_DELETE=( "${FILES[@]:$KEEP_N}" )
for f in ${TO_DELETE[@]}; do
  rm -f "$f"
  echo "[prune] Removed $(basename "$f")"
done
