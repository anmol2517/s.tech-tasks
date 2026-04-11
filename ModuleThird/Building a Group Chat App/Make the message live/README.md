# Live Group Chat App (MERN + WebSockets)

A complete chat app using MongoDB, Express, React, Node, and Socket.IO. When a user sends a message, it appears live for all other connected users.

## Structure

- `backend/` — Express API, MongoDB persistence, Socket.IO server.
- `client/` — React UI with Socket.IO client.

## Setup

1. Install dependencies for backend and client:

   ```bash
   cd "Make the message live/backend"
   npm install
   cd ../client
   npm install
   ```

2. Start MongoDB locally or set `MONGODB_URI` in `backend/server.js` or environment.

3. Run the backend:

   ```bash
   cd "Make the message live/backend"
   npm run dev
   ```

4. Run the frontend:

   ```bash
   cd "Make the message live/client"
   npm run dev
   ```

5. Open the React client at `http://localhost:5173`.

## How it works

- Frontend fetches message history from `GET /api/messages`.
- When a message is posted, backend saves it and emits `newMessage` via Socket.IO.
- All connected clients receive the new message instantly.

## Notes

- Use a display name, then type and send messages.
- The app supports live updates without page refresh.
