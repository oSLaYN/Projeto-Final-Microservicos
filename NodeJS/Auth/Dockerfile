FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env .env

RUN ls -la /usr/src/app/src/

CMD ["node", "src/index.js"]
