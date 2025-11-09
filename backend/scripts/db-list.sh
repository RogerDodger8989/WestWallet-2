#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT_DIR/data/backups"
if [ ! -d "$BACKUP_DIR" ]; then
  echo "No backups directory found: $BACKUP_DIR" >&2
  exit 1
fi
printf "%-40s %10s %20s\n" FILE SIZE DATE
for f in $(ls -1t "$BACKUP_DIR"/sqlite.db.*.bak 2>/dev/null); do
  sz=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")
  dt=$(date -r "$f" +"%Y-%m-%d %H:%M:%S" 2>/dev/null || stat -f %Sm -t "%Y-%m-%d %H:%M:%S" "$f")
  printf "%-40s %10s %20s\n" "$(basename "$f")" "$sz" "$dt"
done