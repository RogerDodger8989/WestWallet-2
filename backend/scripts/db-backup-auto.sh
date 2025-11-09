#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT_DIR/data"
BACKUP_DIR="$DATA_DIR/backups"
DB_FILE="$DATA_DIR/sqlite.db"
DATE_TAG="$(date +%Y%m%d)"

# Only create one backup per calendar day (first invocation)
if [ ! -f "$DB_FILE" ]; then
  echo "[auto-backup] No database file yet, skipping."
  exit 0
fi
mkdir -p "$BACKUP_DIR"
if ls "$BACKUP_DIR"/sqlite.db.$DATE_TAG-*.bak >/dev/null 2>&1; then
  echo "[auto-backup] Backup for today already exists."
  exit 0
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/sqlite.db.$STAMP.bak"
cp -p "$DB_FILE" "$DEST"
echo "[auto-backup] Created $DEST"