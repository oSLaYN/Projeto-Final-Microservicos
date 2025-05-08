FROM node:18-alpine
RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN ls -la /usr/src/app/src/
WORKDIR /usr/src/app/src
CMD ["node", "index.js"]