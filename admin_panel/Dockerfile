FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG DATABASE_URL
ARG AUTH_URL

ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_URL=$AUTH_URL
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

RUN mkdir -p .next/standalone/.next
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/

EXPOSE 3001

WORKDIR /app/.next/standalone

CMD ["node", "server.js"]