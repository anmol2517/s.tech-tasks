# Socket.IO Backend

A modular Socket.IO backend built with Node.js, Express, and MongoDB.

## Structure

- `socket-io/index.js` — main Socket.IO server entry point
- `socket-io/middleware.js` — JWT authentication and socket middleware
- `socket-io/handlers/chat.js` — socket event handlers
- `routes/auth.js` — register/login REST endpoints
- `config/db.js` — MongoDB connection
- `models/User.js` — user data model
- `models/Message.js` — chat message model

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and update values.
3. Start server:
   ```bash
   npm run dev
   ```

## Notes

- Use `socket.handshake.auth.token` when connecting from the client.
- Chat messages are persisted in MongoDB.
- Authentication uses JWT tokens.
