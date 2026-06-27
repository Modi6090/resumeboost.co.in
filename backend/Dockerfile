FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Run as non-root user
USER node

EXPOSE 5000

CMD ["npm", "start"]
