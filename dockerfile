# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Add metadata to the image
LABEL Name="my-cardel-app" \
      Version="1.0.0" \
      Description="A Node.js app running on Docker with Node 18" \
      Maintainer="Oluwasuyi Babayomi <yomzeew@gmail.com>"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port your app will run on (e.g., port 3000)
EXPOSE 3000

# Use the npm start script to run the app
CMD ["npm", "start"]
