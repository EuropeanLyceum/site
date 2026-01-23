FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build arguments for environment variables needed during build
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG JWT_SECRET
ARG DATABASE_URL

# Set as environment variables for the build process
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL

# Build for production
RUN npm run build

# Copy static files and public folder to standalone directory (required for standalone mode)
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public/* .next/standalone/public/ 2>/dev/null || true

ENV NODE_ENV=production

EXPOSE 3001

# якщо standalone
WORKDIR /app/.next/standalone
CMD ["node", "server.js"]

# або звичайний Next.js build
# CMD ["npm", "run", "start"]
