FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS final
COPY src/ ./src/
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
USER node
CMD ["node", "src/index.js"]
