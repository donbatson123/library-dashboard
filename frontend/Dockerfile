# File: frontend/Dockerfile
FROM node:18
WORKDIR /app

# Copy everything (including public/index.html)
COPY . .

# Install dependencies now that we have full context
RUN npm install

CMD ["npm", "start"]
