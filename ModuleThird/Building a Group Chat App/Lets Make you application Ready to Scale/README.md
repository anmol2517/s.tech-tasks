# Scalable Group Chat App (MERN)

A complete MERN stack group chat application with message archiving for performance.

## Features

- React frontend with live chat interface
- Node.js + Express backend API
- MongoDB persistence
- `Chat` and `ArchivedChat` collections
- Nightly archiving of messages older than 1 day
- Modern, responsive UI

## Setup

1. Install dependencies
   ```bash
   npm install
   npm --prefix client install
   npm --prefix server install
   ```
2. Start MongoDB locally or set `MONGODB_URI`
3. Run the app
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`

## Environment

Create `.env` in `server/` with:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/scale-chat
PORT=5000
ARCHIVE_CRON=5 0 * * *
```

## Production

Build the client and start the server:

```bash
npm run build
npm start
```
