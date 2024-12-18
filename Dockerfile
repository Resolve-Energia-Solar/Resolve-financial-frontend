# Use uma imagem base menor para reduzir o tamanho final
FROM node:20-alpine AS builder

# Instalação de dependências e ferramentas necessárias
WORKDIR /app
COPY package.json package-lock.json ./

# Instala apenas as dependências necessárias para build
RUN npm install --legacy-peer-deps

# Copia o restante dos arquivos e realiza o build
COPY . .
RUN npm run build

# Usar uma imagem separada e menor para a execução em produção
FROM node:20-alpine

# Configuração do ambiente e diretório de trabalho
WORKDIR /app

# Copia apenas os artefatos necessários da fase de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "start"]
