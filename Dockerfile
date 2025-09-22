# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static
COPY --from=builder /app/.env.example ./.env.example

EXPOSE 9061

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=9061

CMD ["node", "build/index.js"]