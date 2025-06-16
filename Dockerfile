FROM --platform=${BUILDPLATFORM} node:22-slim

ARG BOT_DIR=bot
RUN mkdir -p ${BOT_DIR}
WORKDIR ${BOT_DIR}

COPY . .
RUN npm ci && npm run build

CMD ["npm", "run", "start"]
