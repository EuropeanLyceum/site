FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

ENV NODE_ENV=production

# Build for production
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install su-exec for switching users
RUN apk add --no-cache su-exec

# Install dependencies for scripts (not included in standalone build)
# These are needed by scripts/auth/*.js files
RUN npm install --no-save bcryptjs@^3.0.2 @types/bcryptjs@^2.4.6 @prisma/client@^6.8.2 && \
    chown -R nextjs:nodejs /app/node_modules

# Copy standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Copy scripts (bcryptjs installed above)
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Copy and set up entrypoint script (needs to be root-owned to run as root)
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Don't switch to nextjs user here - entrypoint will handle it
# USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Use entrypoint to fix permissions, then run migrations and start server
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["sh", "-c", "npx prisma migrate deploy || true && node server.js"]
