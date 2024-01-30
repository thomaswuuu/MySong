# Set node base image
FROM node:20-alpine

# Setup working directory
WORKDIR /app

# Copy package.json to working directory
COPY package*.json ./

# Install package dependecy modules
RUN npm install

# Copy source code to working directory
COPY ./ ./

# Initial process
CMD [ "npm","start" ]