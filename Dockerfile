# ── Stage 1: Dependencies ────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

# ── Stage 2: Build ───────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (standalone output)
# Provide dummy env vars so the build doesn't fail trying to connect to DB
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./build.db"
RUN npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || true
RUN npm run build
RUN rm -f prisma/build.db prisma/build.db-journal

# ── Stage 3: Production ─────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets (logo, uploads, slider images)
COPY --from=builder /app/public ./public

# Copy Prisma schema + engine for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Create writable directories for uploads and DB
RUN mkdir -p /app/public/uploads/full /app/public/uploads/thumbs /app/public/images/slider && \
    chown -R nextjs:nodejs /app/public /app/prisma

# Data volume: DB + uploaded images persist across deploys
VOLUME ["/app/prisma", "/app/public/uploads", "/app/public/images/slider"]

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Push schema to DB on startup (creates tables if missing), then start
CMD ["sh", "-c", "npx prisma db push --skip-generate 2>/dev/null; node server.js"]
