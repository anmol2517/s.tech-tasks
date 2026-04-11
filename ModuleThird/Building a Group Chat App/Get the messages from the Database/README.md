# MERN Group Chat App

This project includes a backend API that reads chat messages from MongoDB and a React frontend that fetches messages when the page loads.

## Run the app

1. Copy `server/.env.example` to `server/.env` and set your MongoDB URI.
2. From the project root:
   - `npm install`
   - `npm run install-all`
3. Start both server and client:
   - `npm start`

## API

- `GET /api/messages` returns all chat messages with `text` and `senderId`.

## Frontend

- React fetches the message list when the chat page loads.
- Messages are shown again after a browser refresh.
