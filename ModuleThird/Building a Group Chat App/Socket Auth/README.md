# MERN Socket.IO Authentication Chat

This project demonstrates a complete MERN stack chat app with Socket.IO authentication on the backend.

## Backend

- Express + MongoDB + Mongoose
- JWT authentication for REST and Socket.IO
- Socket.IO middleware uses `socket.handshake.auth.token`
- Authenticated socket user stored on `socket.user`

## Frontend

- React app for register/login
- Connects to Socket.IO using JWT from login
- Sends and receives chat messages

## Setup

### 1. Backend

1. Open terminal in `server`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`
4. Set `MONGO_URI` and `JWT_SECRET`
5. Start backend:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Open terminal in `client`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm start
   ```

## How Socket.IO identifies the user

1. Client logs in and receives a JWT token.
2. Client creates a Socket.IO connection with `auth: { token }`.
3. Backend `io.use(socketAuth)` reads `socket.handshake.auth.token`.
4. Backend verifies the token and loads the user from MongoDB.
5. Authenticated user is available as `socket.user` for all socket events.

## Important Files

- `server/src/index.js`
- `server/src/routes/auth.js`
- `server/src/middleware/authMiddleware.js`
- `client/src/components/RegisterLogin.js`
- `client/src/components/Chat.js`
