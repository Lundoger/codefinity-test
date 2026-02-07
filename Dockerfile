FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN corepack enable && corepack prepare pnpm@10.5.2 --activate
RUN pnpm install --frozen-lockfile

COPY client ./client
COPY server ./server

EXPOSE 5173
EXPOSE 3000

CMD ["pnpm", "start"]
