# Stage 1: Build the React Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
# Copy root package files
COPY package*.json ./
# Copy frontend package file
COPY frontend/package*.json ./frontend/
# Install dependencies for the whole workspace (optimized by npm)
RUN npm ci -w fueleu-frontend
# Copy frontend source
COPY frontend/ ./frontend/
# Build frontend
RUN npm run build -w fueleu-frontend

# Stage 2: Build the Node.js Backend
FROM node:20-alpine AS build-backend
WORKDIR /app
# Copy root package files
COPY package*.json ./
# Copy backend package file
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma
# Install dependencies for the whole workspace
RUN npm ci -w fueleu-backend && \
    npx prisma generate --schema=backend/prisma/schema.prisma
# Copy backend source
COPY backend/ ./backend/
# Build backend
RUN npm run build -w fueleu-backend

# Stage 3: Optimized Production Image
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Upgrade packages to fix vulnerabilities (e.g., zlib CVE-2026-22184)
RUN apk update && apk upgrade --no-cache zlib && \
    npm install -g npm@latest

# Copy root package files
COPY package*.json ./
# Copy backend package file
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma

# Install only production dependencies for the backend
RUN npm ci --omit=dev -w fueleu-backend && \
    npx prisma generate --schema=backend/prisma/schema.prisma

# Copy the compiled backend JS files
COPY --from=build-backend /app/backend/dist ./backend/dist

# Copy the compiled frontend static files
COPY --from=build-frontend /app/frontend/dist ./frontend-dist

# Create a non-root user for security
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

WORKDIR /app/backend
CMD ["node", "dist/infrastructure/server/server.js"]
