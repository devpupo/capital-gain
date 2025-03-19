# Use a specific Node.js version for reproducibility
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY src/ ./src/

# Set user to non-root for security
USER node

# Command to run the application
CMD ["node", "src/index.js"]