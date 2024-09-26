FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
