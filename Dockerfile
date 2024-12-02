# Use a Node.js base image
FROM node:16

#DEFINE ARGUMENTS
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD
ARG PORT
ARG JWT_SECRET
ARG REDIS_HOST
ARG REDIS_PORT
ARG PROJECT_ID
ARG GCP_SA_KEY
ARG GCP_REGION
ARG DB_TYPE

# USE ARGUMENTS IN ENVIRONMENT VARIABLES
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_NAME=$DB_NAME
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV PORT=$PORT
ENV JWT_SECRET=$JWT_SECRET
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PORT=$REDIS_PORT
ENV PROJECT_ID=$PROJECT_ID
ENV GCP_SA_KEY=$GCP_SA_KEY
ENV GCP_REGION=$GCP_REGION
ENV DB_TYPE=$DB_TYPE

# Set the working directory
WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

#  Install TypeScript globally
RUN npm install -g typescript

# Copy the source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port (if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
