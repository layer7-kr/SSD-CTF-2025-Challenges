FROM node:18-slim

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app .

EXPOSE 3000

CMD ["node", "src/index.js"]