FROM node:18.17-bullseye

RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://bun.sh/install | bash

WORKDIR /app

# Copy configuration files first
COPY package.json bun.lockb ./
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN /root/.bun/bin/bun install
RUN /root/.bun/bin/bun prisma generate

# Copy rest of the application
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD ["/root/.bun/bin/bun", "run", "dev"]