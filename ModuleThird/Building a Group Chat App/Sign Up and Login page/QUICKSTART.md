# Quick Start Guide - MERN Auth App

## TL;DR - Fast Setup (5 Minutes)

### Prerequisites
- Node.js installed? [Get it here](https://nodejs.org/)
- MongoDB running? Use local or [MongoDB Atlas](https://www.mongodb.com/atlas)

### Step 1: Backend Setup
```bash
cd backend
npm install
npm start
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Open in Browser
Go to: **http://localhost:3000**

---

## That's It! 

### Test It:
1. **Sign Up**: Create new account with name, email, phone, password
2. **Login**: Use your email or phone + password
3. **Dashboard**: See your profile information
4. **Logout**: Return to login screen

---

## Common Commands

```bash
# Start Backend
cd backend && npm start

# Start Frontend
cd frontend && npm run dev

# Install dependencies
npm install

# Build frontend for production
cd frontend && npm run build
```

---

## Default Credentials (For Testing)

Create a test account:
- **Name**: Test User
- **Email**: test@example.com
- **Phone**: 1234567890
- **Password**: test123

Then login with either:
- Email: `test@example.com`
- OR Phone: `1234567890`

---

## What's Running Where?

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (or your Atlas cluster)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Port 5000 in use" | Change PORT in `backend/.env` |
| "MongoDB connection error" | Start MongoDB or update `MONGODB_URI` in `backend/.env` |
| "Blank page on frontend" | Wait 30s for Vite, then hard refresh (Ctrl+Shift+R) |
| "CORS error" | Ensure both servers are running |

---

## Environment File (.env)

Already set up in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

For production, change `JWT_SECRET` to something strong!

---

**Ready to go!** Questions? Check the main README.md for detailed docs.
