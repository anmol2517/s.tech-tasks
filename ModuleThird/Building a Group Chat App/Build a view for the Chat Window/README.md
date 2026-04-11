# MERN Chat Window UI

This project is a minimal MERN stack chat window demo.

## Features

- React chat UI with side panel and message list
- Timestamp formatting and message bubble styling
- Scroll-to-bottom behavior for new messages
- Express API with MongoDB backend
- `GET /api/messages` and `POST /api/messages`

## Install

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Run `npm install` in the root.
3. Run `npm install` in the `client` folder.
4. Start both server and client with:

```bash
npm run dev
```

The React app will run on `http://localhost:3000` and the backend on `http://localhost:5000`.
