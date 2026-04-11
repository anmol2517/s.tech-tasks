const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const usersRoute = require("./routes/users");

dotenv.config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use("/api/users", usersRoute);
app.get("/", (req, res) => res.send("Socket.IO personal messaging API is running."));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const makeRoomId = (emailA, emailB) => {
  const normalized = [emailA || "", emailB || ""]
    .map((email) => email.trim().toLowerCase())
    .sort();
  return `room_${normalized[0]}_${normalized[1]}`;
};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", ({ roomId, email }) => {
    if (!roomId) {
      return;
    }
    socket.join(roomId);
    socket.data.email = email;
    socket.emit("joined_room", { roomId });
    socket.to(roomId).emit("user_joined", { roomId, email });
  });

  socket.on("leave_room", ({ roomId }) => {
    if (!roomId) {
      return;
    }
    socket.leave(roomId);
    socket.emit("left_room", { roomId });
    socket.to(roomId).emit("user_left", { roomId, email: socket.data.email });
  });

  socket.on("send_message", ({ roomId, message, sender }) => {
    if (!roomId || !message) {
      return;
    }
    const payload = {
      roomId,
      message,
      sender,
      createdAt: new Date().toISOString()
    };
    io.to(roomId).emit("new_message", payload);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern-chat")
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });
