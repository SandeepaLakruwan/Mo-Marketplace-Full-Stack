# Stage 1: Build React app
FROM node:22-alpine AS builder
WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Pass API URL as build arg (baked into the bundle)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]