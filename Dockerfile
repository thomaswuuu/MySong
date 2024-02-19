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

# Create swagger json file
RUN npm run swagger

# Initial process
CMD [ "npm","start" ]