#!/bin/sh
set -e

echo "==> Creating database tables..."

mkdir -p /app/data

# Use the prisma binary directly (npx not available in standalone)
node /app/node_modules/prisma/build/index.js db push \
  --schema=/app/prisma/schema.prisma \
  --skip-generate \
  --accept-data-loss 2>&1 || {
    echo "WARNING: prisma db push failed, trying again..."
    sleep 1
    node /app/node_modules/prisma/build/index.js db push \
      --schema=/app/prisma/schema.prisma \
      --skip-generate \
      --accept-data-loss 2>&1 || echo "ERROR: Could not create tables"
  }

echo "==> Starting server..."
exec node server.js
