# MERN Socket.IO Group Chat

A complete MERN stack chat project with real-time Socket.IO communication between React frontend and Express/Socket.IO backend.

## Setup

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Start the app with:
   ```bash
   npm run dev
   ```
3. Open the frontend at `http://localhost:5173` and the backend server listens on `http://localhost:3000`.

## Notes

- The frontend uses `socket.io-client` to connect to `http://localhost:3000`.
- The backend uses Express, Socket.IO, and MongoDB to store chat messages.
- Set `MONGO_URI` in a `.env` file if you want a custom MongoDB connection string.
