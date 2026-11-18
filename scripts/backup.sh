#!/usr/bin/env bash
set -Eeuo pipefail

# -----------------------------
# Налаштування
# -----------------------------
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_ROOT="$PROJECT_DIR/backups"

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="$BACKUP_ROOT/$DATE"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."

# -----------------------------
# PostgreSQL
# -----------------------------
echo "[$(date)] Backing up PostgreSQL..."

docker exec postgres_db \
  pg_dump -U postgres -d liceum \
  | gzip > "$BACKUP_DIR/liceum_postgres.sql.gz"

# -----------------------------
# admin-uploads
# -----------------------------
echo "[$(date)] Backing up admin-uploads..."

docker run --rm \
  -v admin-uploads:/data:ro \
  -v "$BACKUP_DIR":/backup \
  alpine sh -c "tar czf /backup/admin-uploads.tar.gz -C /data ."

# -----------------------------
# admin-db
# -----------------------------
echo "[$(date)] Backing up admin-db..."

docker run --rm \
  -v admin-db:/data:ro \
  -v "$BACKUP_DIR":/backup \
  alpine sh -c "tar czf /backup/admin-db.tar.gz -C /data ."

# -----------------------------
# Копія compose файлу
# -----------------------------
cp "$PROJECT_DIR/docker-compose.yml" "$BACKUP_DIR/"

# -----------------------------
# Видалення старих бекапів (>21 день)
# -----------------------------
echo "[$(date)] Cleaning old backups..."

find "$BACKUP_ROOT" \
  -mindepth 1 -maxdepth 1 \
  -type d -mtime +21 \
  -exec rm -rf {} \;

echo "[$(date)] Backup completed successfully: $BACKUP_DIR"


