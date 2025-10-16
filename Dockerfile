FROM node:20-alpine AS builder
WORKDIR /app

ARG ENV_FILE
COPY ${ENV_FILE} .env

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN npm run build
RUN npm prune --production --ignore-scripts

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

ARG ENV_FILE
COPY ${ENV_FILE} .env
RUN export $(grep -v '^#' .env | xargs)

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
