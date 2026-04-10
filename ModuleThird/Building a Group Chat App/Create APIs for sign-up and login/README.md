# Group Chat Auth APIs

This project contains a MERN stack implementation for Sign-Up and Login APIs.

## Backend

Folder: `backend`

1. Install dependencies:
   - `cd backend`
   - `npm install`

2. Start MongoDB locally if not already running.
   - Default connection is: `mongodb://127.0.0.1:27017/groupchat`

3. Start backend server:
   - `npm start`

4. Backend endpoints:
   - `POST http://localhost:5000/api/auth/signup`
   - `POST http://localhost:5000/api/auth/login`

## Frontend

Folder: `frontend`

1. Install dependencies:
   - `cd frontend`
   - `npm install`

2. Start the React frontend:
   - `npm run dev`

3. Open the URL shown in the terminal, usually `http://localhost:3000`.

## Usage

- Use the Sign-Up form to create a new user with `name`, `email`, `phone`, and `password`.
- Use the Login form to authenticate using `email or phone` and `password`.
- On successful login, the frontend displays a JSON Web Token returned by the backend.

## Notes

- Passwords are encrypted with `bcryptjs` before saving to MongoDB.
- Login verifies the provided password and returns a JWT token.
- No extra tech stack is used beyond MERN.
