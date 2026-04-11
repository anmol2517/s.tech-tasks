# MERN Group Chat with AWS Media Sharing

This project is a full MERN stack chat application with real-time messaging and media upload support using AWS S3.

## Features

- User login with room selection
- Real-time chat with Socket.IO
- Media upload support for images, videos, and other files
- AWS S3 file storage for uploaded media
- Backend broadcasts media message events with S3 URLs

## Project Structure

- `backend/` — Express API, Socket.IO server, AWS S3 upload endpoint
- `frontend/` — React + Vite chat user interface

## Setup

1. Create an AWS S3 bucket.
2. Configure CORS on the bucket.
3. Create an IAM user with programmatic access and write permissions to the bucket.
4. Copy `backend/.env.example` to `backend/.env` and add your AWS credentials and bucket settings.

## Run locally

```bash
npm install
npm run install-all
npm run dev
```

Open the frontend in `http://localhost:5173` and the backend runs on `http://localhost:4000`.

## AWS S3 CORS Example

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["http://localhost:5173"],
    "ExposeHeaders": ["ETag"]
  }
]
```
