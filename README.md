# Chat MVP (Socket.io + React)

Production-quality MVP for a realtime chat with bots, built as a pnpm monorepo.

## Stack
- Frontend: React + Vite + Tailwind + Zustand
- Backend: Node.js + Express + Socket.io
- Storage: in-memory on server

## Monorepo
```
/client
/server
package.json
pnpm-workspace.yaml
Dockerfile
```

## Install
```bash
pnpm install
```

## Run locally (dev)
```bash
pnpm dev
```
Client: `http://localhost:5173`  
Server health: `http://localhost:3000/health`

## Build
```bash
pnpm build
```

## Run with Docker
Use Docker Compose to start the whole app:
```bash
docker compose up
```

## Env vars
- `VITE_SOCKET_URL` (client): override Socket.io server URL

## Manual test checklist
- Session: first visit creates random name + avatar and persists across reloads
- Contacts: list excludes current user, shows bots, search works
- Filter: online-only toggle shows only online contacts
- Switch chat: history loads, empty chat shows placeholder
- Send: Enter and button send, empty/space-only is ignored
- Messages: incoming/outgoing styles and alignment are different
- Presence: online/offline indicator updates on disconnect/reconnect
- Bots:
  - Echo: replies instantly with same text
  - Reverse: replies with reversed text after ~3s
  - Ignore: no responses
  - Spam: after first chat activation, sends messages every 10–120s
