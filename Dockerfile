FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY tests/ ./tests/

USER node

CMD ["node", "src/index.js"]