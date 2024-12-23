FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos essenciais e instala as dependências
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copia todo o projeto e realiza o build
COPY . .
RUN npm run build

# Expose a porta padrão do Next.js
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start"]