# Usar a imagem oficial do Node.js
FROM node:20-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependências para o diretório de trabalho
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante do código-fonte para o container
COPY . .

# Realizar o build da aplicação
RUN npm run build

# Expor a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]