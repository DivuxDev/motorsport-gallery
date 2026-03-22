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

RUN npx prisma generate

# Create a temporary DB so Next.js can pre-render pages that call Prisma
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/prisma/build.db"
RUN npx prisma db push --schema=/app/prisma/schema.prisma --skip-generate --accept-data-loss 2>/dev/null || true
RUN npm run build
RUN rm -f /app/prisma/build.db /app/prisma/build.db-journal

# ── Stage 3: Production ─────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/prod.db"
ENV AUTH_TRUST_HOST=true

RUN apk add --no-cache openssl libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Prisma schema + engine + seed for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create all writable directories and set ownership
RUN mkdir -p /app/data /app/public/uploads/full /app/public/uploads/thumbs /app/public/images/slider && \
    chown -R nextjs:nodejs /app

VOLUME ["/app/data", "/app/public/uploads", "/app/public/images/slider"]

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
