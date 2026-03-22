#!/bin/sh
set -e

echo "==> Creating database tables..."
cd /app

# Ensure the data directory exists
mkdir -p /app/data

# Push schema to create/update tables
npx prisma db push --schema=/app/prisma/schema.prisma --skip-generate --accept-data-loss 2>&1 || {
  echo "WARNING: prisma db push failed, retrying..."
  sleep 1
  npx prisma db push --schema=/app/prisma/schema.prisma --skip-generate --accept-data-loss 2>&1 || echo "WARNING: Could not push schema"
}

echo "==> Starting server..."
exec node server.js
