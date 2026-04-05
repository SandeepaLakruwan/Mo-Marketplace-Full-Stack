# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install libc6-compat if you have native dependencies
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts \
    && npm cache clean --force

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Change ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000
CMD ["node", "dist/main"]