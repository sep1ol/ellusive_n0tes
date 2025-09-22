# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json /app
RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20-alpine

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .

EXPOSE 9061

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=9061

CMD ["node", "build"]