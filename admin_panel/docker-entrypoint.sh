#!/bin/sh
set -e

# Fix permissions for prisma directory (volume mount)
# This needs to run as root before switching to nextjs user
if [ "$(id -u)" = "0" ]; then
    # Running as root - fix permissions
    mkdir -p /app/prisma
    chown -R nextjs:nodejs /app/prisma 2>/dev/null || true
    chmod 755 /app/prisma 2>/dev/null || true
    
    # Switch to nextjs user and run the command
    exec su-exec nextjs "$@"
else
    # Already running as nextjs - just run the command
    exec "$@"
fi

