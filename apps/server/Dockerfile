FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.6.3

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy the core and server packages
COPY packages/core ./packages/core
COPY packages/agents ./packages/agents
COPY apps/server ./apps/server

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build core package
RUN pnpm --filter @getgrowly/core build

# Build agents package
RUN pnpm --filter @getgrowly/agents build

# Build server package
RUN pnpm --filter @getgrowly/server build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package.json files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/agents/package.json ./packages/agents/
COPY --from=builder /app/apps/server/package.json ./apps/server/

# Copy built artifacts
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/agents/dist ./packages/agents/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Install production dependencies only
RUN npm install -g pnpm@10.6.3 && \
    pnpm install --prod

# Set environment variables
ENV NODE_ENV=production

# Expose the port the server runs on
EXPOSE 8080

# Change to server directory as working directory
WORKDIR /app/apps/server

# Command to run the server
CMD ["node", "dist/main"]