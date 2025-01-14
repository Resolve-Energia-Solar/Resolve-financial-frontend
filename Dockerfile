FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROMIUM_PATH=/usr/bin/chromium-browser

CMD ["npm", "run", "start"]
