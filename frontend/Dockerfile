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

# Disable ESLint errors during production build
ENV NODE_ENV=production
ENV NEXT_PUBLIC_ESLINT_NO_DEV_ERRORS=true

# Build Next.js with standalone output
RUN npm run build

# Copy static files and public folder to standalone directory (required for standalone mode)
RUN mkdir -p .next/standalone/.next/static && cp -r .next/static/* .next/standalone/.next/static/
RUN mkdir -p .next/standalone/public && cp -r public/* .next/standalone/public/ 2>/dev/null || true

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install curl for debugging/testing
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build (which now includes static files and public folder)
# Copy the standalone directory structure
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /app/.next/standalone

CMD ["node", "server.js"]
