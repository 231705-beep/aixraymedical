# Base image for building the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Copy built application and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./.env

# Create uploads directory
RUN mkdir -p uploads

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
