# MERN Authentication App

A complete MERN (MongoDB, Express, React, Node.js) stack authentication application with Sign Up and Login functionality.

## Features

- **User Registration**: Sign up with name, email, phone number, and password
- **User Login**: Login with email or phone number and password
- **Password Hashing**: Secure password storage using bcryptjs
- **JWT Authentication**: Token-based authentication for secure sessions
- **Protected Routes**: Dashboard only accessible to authenticated users
- **Form Validation**: Client and server-side validation
- **Responsive Design**: Modern, clean UI with gradient styling

## Project Structure

```
mern-auth/
├── backend/                 # Express + MongoDB backend
│   ├── models/
│   │   └── User.js         # User model with validation
│   ├── routes/
│   │   └── auth.js         # Authentication routes (signup/login)
│   ├── server.js           # Express server setup
│   ├── package.json
│   └── .env                # Environment variables
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Signup.jsx  # Sign up form page
│   │   │   ├── Login.jsx   # Login form page
│   │   │   └── Dashboard.jsx # Protected dashboard
│   │   ├── api.js          # API service functions
│   │   ├── PrivateRoute.jsx # Protected route component
│   │   ├── App.jsx         # Main app component with routing
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Styling
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env                # Environment variables (optional)
│
└── README.md               # This file
```

## Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **MongoDB** running locally or MongoDB Atlas account

## MongoDB Setup

### Option 1: Local MongoDB Installation
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB runs as a service by default
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Verify MongoDB is running:
   ```bash
   mongo --version
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get connection string and update `.env` in backend folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_db
   ```

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment

Create or update `.env` file in `backend/` folder:

```
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**Change `JWT_SECRET` to a strong random string for production!**

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

## Using the Application

1. **Open browser** and go to `http://localhost:3000`

2. **Sign Up**:
   - Click "Sign Up" on the home page
   - Enter: Name, Email, Phone Number (10+ digits), Password (6+ characters)
   - Click "Sign Up" button
   - You'll be redirected to dashboard if successful

3. **Login**:
   - Enter Email OR Phone Number
   - Enter Password
   - Click "Login" button
   - Access your protected dashboard

4. **Dashboard**:
   - View your profile information
   - Click "Logout" to exit

## API Endpoints

### POST `/api/auth/signup`
Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### POST `/api/auth/login`
Login with email or phone number

**Request Body:**
```json
{
  "identifier": "john@example.com or 9876543210",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

## Validation Rules

### Sign Up Form
- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Phone**: 10 or more digits
- **Password**: Minimum 6 characters

### Login Form
- **Identifier**: Email or phone number (required)
- **Password**: Required

## Troubleshooting

### "MongoDB connection error"
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env` is correct
- For local: ensure `mongodb://localhost:27017/auth_db`

### "Port 5000 already in use"
- Change `PORT` in backend `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### "Cannot GET /api/auth/signup"
- Ensure backend is running on port 5000
- Check if routes are properly defined

### "CORS error"
- Backend CORS is enabled for `http://localhost:3000`
- If using different frontend URL, update CORS in `backend/server.js`

### "Token not stored"
- Check browser's LocalStorage (F12 > Application > LocalStorage)
- Clear LocalStorage and try again: `localStorage.clear()`

## Security Notes

- **Change JWT_SECRET**: Never use default secret in production
- **Use HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit `.env` files to git
- **Password Hashing**: All passwords are hashed using bcryptjs
- **Token Expiration**: Tokens expire after 7 days

## Production Deployment

Before deploying to production:

1. **Update JWT_SECRET** to a strong random value
2. **Use MongoDB Atlas** instead of local MongoDB
3. **Update CORS settings** for production domain
4. **Build frontend**: `npm run build` in frontend folder
5. **Deploy backend** to services like Heroku, Railway, or Render
6. **Deploy frontend** to Vercel, Netlify, or similar

## Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation
- **cors**: Cross-origin resource sharing
- **express-validator**: Input validation
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **vite**: Build tool

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues:
1. Check the Troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check console for error messages
5. Verify `.env` files are properly configured

---

**Enjoy building with MERN!**
