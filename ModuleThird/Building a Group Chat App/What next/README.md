# MERN Group Chat App

A complete group chat application built with:
- MongoDB + Mongoose
- Express + Socket.IO
- React + Vite

## Features
- Real-time group chat using Socket.IO
- Create and join chat rooms
- Room message history stored in MongoDB
- Responsive React client with room management
- Clean separation of server/client code and best-practice structure

## Setup
1. Install dependencies:
   ```bash
   npm install --workspaces
   ```

2. Create a `.env` file in `server/`:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/mern-group-chat
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

4. Open the client in browser:
   - Usually `http://localhost:5173`

## Production
Start only the backend with:
```bash
npm start
```

## Notes
- The app uses Socket.IO best practices for connection lifecycle, room events, and event validation.
- Frontend communicates using REST to load rooms and history, and Socket.IO for real-time messages.
