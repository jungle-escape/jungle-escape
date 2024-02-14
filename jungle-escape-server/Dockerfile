FROM node:21-alpine
RUN apk add --update redis
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["sh", "-c", "redis-server --daemonize yes; node index.js"]