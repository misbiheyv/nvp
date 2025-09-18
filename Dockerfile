FROM --platform=${BUILDPLATFORM} node:22-slim

ARG BOT_DIR=bot
RUN mkdir -p ${BOT_DIR} /data \
  && apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
WORKDIR ${BOT_DIR}

COPY . .
RUN npm ci && npm run build

VOLUME ["/data"]

CMD ["npm", "run", "start"]
