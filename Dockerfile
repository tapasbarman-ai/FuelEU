# Stage 1: Build the React Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build the Node.js Backend
FROM node:20-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci && \
    npx prisma generate
COPY backend/ .
RUN npm run build

# Stage 3: Optimized Production Image
FROM node:20-alpine
# Set Node environment to production
ENV NODE_ENV=production

WORKDIR /app/backend

# Copy backend package files and install only production dependencies
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci --only=production && \
    npx prisma generate

# Copy the compiled backend JS files
COPY --from=build-backend /app/backend/dist ./dist

# Copy the compiled frontend static files into a known directory
COPY --from=build-frontend /app/frontend/dist /app/frontend-dist

# Create a non-root user for security (Optimization & Best Practice)
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

CMD ["node", "dist/infrastructure/server/server.js"]
