FROM node:20-alpine

# 1. Встановлюємо необхідні системні залежності для sharp та prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

# 2. Встановлюємо залежності, включаючи sharp для конкретної платформи
RUN npm install
# Явно додаємо sharp для Linux Alpine (musl)
RUN npm install --os=linux --libc=musl --cpu=x64 sharp

COPY . .

# Build arguments (залиш як було)
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG DATABASE_URL
ARG AUTH_URL

ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_URL=$AUTH_URL
ENV NODE_ENV=production 

# 3. Prisma та Build
RUN npx prisma generate
RUN npm run build

# 4. Standalone setup
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public/* .next/standalone/public/ 2>/dev/null || true

EXPOSE 3001

WORKDIR /app/.next/standalone
CMD ["node", "server.js"]