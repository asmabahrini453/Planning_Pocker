FROM node:20-alpine

WORKDIR /app

# Copy only package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 3001

# Start in dev mode
CMD ["npm", "run", "start:dev"]