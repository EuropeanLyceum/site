FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build for production
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

# якщо standalone
CMD ["node", ".next/standalone/server.js"]

# або звичайний Next.js build
# CMD ["npm", "run", "start"]
