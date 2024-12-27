FROM node:20

# Instalação das dependências necessárias
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

# Instalação do Husky (opcional)
RUN npm install -g husky

# Copia os arquivos do projeto e instala as dependências
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production --legacy-peer-deps

# Copia o restante dos arquivos do projeto
COPY . .

# Realiza o build da aplicação
RUN npm run build

# Inicia o servidor Next.js em produção
CMD ["npm", "start"]
