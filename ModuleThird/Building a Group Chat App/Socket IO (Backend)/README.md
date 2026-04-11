# Socket.IO Backend for MERN Group Chat

This backend server uses Express, Socket.IO, and MongoDB to support real-time group chat functionality.

## Features

- Real-time bidirectional communication with Socket.IO
- Message history stored in MongoDB
- REST endpoint to load previous messages
- `joinRoom`, `sendMessage`, `typing`, and `stopTyping` socket events
- CORS enabled for frontend connections

## Setup

### Backend

1. Install backend dependencies

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/socketio-group-chat
CLIENT_URL=http://localhost:3000
```

3. Start the backend server

```bash
npm run dev
```

### Frontend

1. Change into the client folder and install dependencies

```bash
cd client
npm install
```

2. Start the React frontend

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

> The React client runs on port `3000` and connects to the backend at `http://localhost:5000`.

## API Endpoints

## API Endpoints

- `GET /` - health check
- `GET /api/messages` - fetch latest 50 chat messages
- `POST /api/messages` - save and broadcast a message manually (optional)

## Socket.IO Events

### Client emits

- `joinRoom`
  - payload: `{ username, room }`
- `sendMessage`
  - payload: `{ sender, text, room }`
- `typing`
  - payload: `{ username, room }`
- `stopTyping`
  - payload: `{ username, room }`

### Server emits

- `receiveMessage`
- `notification`
- `typing`
- `stopTyping`
- `errorMessage`

## Notes

- Use a matching client URL in `.env` for CORS.
- This backend is ready to connect with any React front-end using Socket.IO client.
