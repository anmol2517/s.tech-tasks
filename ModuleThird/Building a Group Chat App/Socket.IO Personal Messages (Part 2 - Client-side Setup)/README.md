# Socket.IO Personal Messages (MERN)

This project is a complete MERN stack chat application with Socket.IO personal messaging and dynamic room join/leave behavior.

## Features

- React frontend with email search for personal chat rooms
- Express + Socket.IO backend for room-based messaging
- MongoDB user search + upsert API
- Private room IDs generated from both user emails
- Messages emitted only to the joined room
- Client listens for `new_message`, `user_joined`, and `user_left`

## Setup

### Backend

1. Open `server` folder.
2. Copy `.env.example` to `.env`.
3. Update `MONGO_URI` if needed.
4. Install packages:

```bash
cd server
npm install
```

5. Start backend:

```bash
npm run dev
```

### Frontend

1. Open `client` folder.
2. Install packages:

```bash
cd client
npm install
```

3. Start the client:

```bash
npm run dev
```

### Usage

- Enter your email.
- Search for the recipient email.
- Click `Join Room` to create/join a unique private room.
- Send messages and receive them only inside the selected room.

## Notes

- Backend listens on `http://localhost:5000`.
- Frontend runs on `http://localhost:5173`.
- The unique room ID is deterministic and built from both email addresses.
