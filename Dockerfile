# # Already working dockerfile
# FROM node:18.17-bullseye

# RUN apt-get update && apt-get install -y curl \
#     && curl -fsSL https://bun.sh/install | bash

# WORKDIR /app

# # Copy configuration files first
# COPY package.json bun.lockb ./
# COPY prisma ./prisma

# # Install dependencies and generate Prisma client
# RUN /root/.bun/bin/bun install
# RUN /root/.bun/bin/bun prisma generate

# # Copy rest of the application
# COPY . .

# # Expose application port
# EXPOSE 3000

# # Start the application
# CMD ["/root/.bun/bin/bun", "run", "dev"]
# # Already working dockerfile

##############################

# Use Node.js 18 as the base image
FROM node:18-bullseye as builder

# Install bun
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://bun.sh/install | bash

WORKDIR /app

# Copy configuration files
COPY package.json bun.lockb ./
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN /root/.bun/bin/bun install
RUN /root/.bun/bin/bun prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN /root/.bun/bin/bun run build

# Production image
FROM node:18-bullseye-slim as runner

WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files first
COPY package.json bun.lockb ./

# Install required dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    openssl \
    libssl-dev \
    && curl -fsSL https://bun.sh/install | bash \
    && /root/.bun/bin/bun install --production

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Set the correct permissions
RUN chown -R nextjs:nodejs .

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Set production environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

# PROD
ENV NEXTAUTH_URL "http://srvifle:3128"
ENV NEXT_PUBLIC_NEXTAUTH_URL "http://srvifle:3128"
ENV NEXTAUTH_URL_INTERNAL "http://localhost:3000"
ENV COOKIE_DOMAIN "srvifle"
# DEV
# ENV NEXTAUTH_URL "http://localhost:3128"
# ENV NEXT_PUBLIC_NEXTAUTH_URL "http://localhost:3128"
# ENV NEXTAUTH_URL_INTERNAL "http://localhost:3000"
# ENV COOKIE_DOMAIN "localhost"

# Start the application
CMD ["node", "server.js"]
