# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile

ENV NODE_ENV=production
RUN bun run build

EXPOSE 5185/tcp
ENTRYPOINT [ "bun", "run", "server.ts" ]
