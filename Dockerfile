# Dockerfile for the Fragments Node.js microservice
# Builds a Docker Image that can run the server inside a container.

FROM node:23.1.0

# Image metadata
LABEL maintainer="Harshita <hharshita3@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Default environment variables (safe defaults, no secrets)
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src

# Container listens on port 8080
EXPOSE 8080

# Start the server
CMD npm start



