# ChatApp Backend

This project is a complete chat backend with a React frontend integration. Every chat message is stored in MongoDB when the user sends it.

## Features

- `POST /api/messages` stores a chat message in the database
- `GET /api/messages` returns all saved chat messages
- Frontend page sends chat messages to the backend and shows persisted messages
- Message model stores `userId`, `text`, and `createdAt`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start MongoDB locally, or set `MONGO_URI` before running.

3. Start the server:

```bash
npm start
```

4. Open the browser at:

```
http://localhost:5000
```

## API

### Save a chat message

`POST /api/messages`

Body:

```json
{
  "userId": "user123",
  "text": "Hello from the chat app"
}
```

### Fetch chat messages

`GET /api/messages`

## Notes

- The frontend is served from `public/index.html` and calls the backend API directly.
- The database collection is created automatically in MongoDB when messages are saved.
