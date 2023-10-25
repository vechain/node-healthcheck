# Build stage for amd64 architecture
FROM --platform=linux/amd64 node:gallium-alpine3.18 AS builder-amd64

WORKDIR /app
# Copy the package.json and package-lock.json to the container
COPY ./src/package*.json .
RUN npm ci
# Copy the rest of the application code to the container
COPY ./src .

# Build stage for arm64/v8 architecture
FROM --platform=linux/arm64/v8 node:gallium-alpine3.18 AS builder-arm64

WORKDIR /app
# Copy the package.json and package-lock.json to the container
COPY ./src/package*.json .
RUN npm ci
# Copy the rest of the application code to the container
COPY ./src .

# Production stage
FROM node:gallium-alpine3.18

WORKDIR /app

# Copy the files from the appropriate builder stage based on the target architecture
COPY --from=builder-amd64 /app /app
COPY --from=builder-arm64 /app /app

# Set the default command to run when starting the container
CMD ["npm", "start"]