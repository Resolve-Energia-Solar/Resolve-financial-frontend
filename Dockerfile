FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk \
    libstdc++ \
    nspr \
    alsa-lib \
    libc6-compat \
    libxcomposite \
    libxrandr \
    libxdamage \
    libxi \
    libxtst \
    libjpeg-turbo \
    libwebp \
    libpng \
    libgdk-pixbuf \
    libxinerama \
    libfontconfig \
    libfreetype \
    libx11 \
    libxcb \
    libxext \
    libxrender \
    && echo "Chromium setup completed"


COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROMIUM_PATH=/usr/bin/chromium

CMD ["npm", "run", "start"]