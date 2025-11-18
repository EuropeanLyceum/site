FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Disable ESLint errors during production build
ENV NODE_ENV=production
ENV NEXT_PUBLIC_ESLINT_NO_DEV_ERRORS=true

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3001

CMD ["node", ".next/standalone/server.js"]
