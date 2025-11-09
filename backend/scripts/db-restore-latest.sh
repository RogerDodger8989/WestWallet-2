#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT_DIR/data"
BACKUP_DIR="$DATA_DIR/backups"
DB_FILE="$DATA_DIR/sqlite.db"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "No backups directory found: $BACKUP_DIR" >&2
  exit 1
fi

LATEST="$(ls -1t "$BACKUP_DIR"/sqlite.db.*.bak 2>/dev/null | head -n1 || true)"
if [ -z "$LATEST" ]; then
  echo "No backup files found in $BACKUP_DIR" >&2
  exit 1
fi

cp -p "$LATEST" "$DB_FILE"
echo "Restored $LATEST -> $DB_FILE"