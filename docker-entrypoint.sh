#!/bin/sh
set -e

echo "==> Creating database tables..."
mkdir -p /app/data

node /app/node_modules/prisma/build/index.js db push \
  --schema=/app/prisma/schema.prisma \
  --skip-generate \
  --accept-data-loss 2>&1 || {
    echo "WARNING: prisma db push failed, retrying..."
    sleep 1
    node /app/node_modules/prisma/build/index.js db push \
      --schema=/app/prisma/schema.prisma \
      --skip-generate \
      --accept-data-loss 2>&1 || echo "ERROR: Could not create tables"
  }

echo "==> Seeding admin user if needed..."
node /app/prisma/seed-docker.js 2>&1 || echo "WARNING: Seed failed"

echo "==> Starting server..."
exec node server.js
