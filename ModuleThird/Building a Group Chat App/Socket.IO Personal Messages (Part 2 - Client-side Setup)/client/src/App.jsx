import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const socket = io(SERVER_URL, { autoConnect: true });

const makeRoomId = (senderEmail, recipientEmail) => {
  const normalized = [senderEmail.trim().toLowerCase(), recipientEmail.trim().toLowerCase()].sort();
  return `room_${normalized[0]}_${normalized[1]}`;
};

function App() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("");
  const [activeRoomUser, setActiveRoomUser] = useState("");
  const messagesRef = useRef(null);

  useEffect(() => {
    socket.on("joined_room", ({ roomId }) => {
      setRoomId(roomId);
      setStatus("Joined room " + roomId);
    });

    socket.on("new_message", (payload) => {
      setMessages((prev) => [...prev, payload]);
    });

    socket.on("user_joined", ({ email }) => {
      if (email) {
        setMessages((prev) => [
          ...prev,
          { system: true, message: `${email} joined the room.` }
        ]);
      }
    });

    socket.on("user_left", ({ email }) => {
      if (email) {
        setMessages((prev) => [
          ...prev,
          { system: true, message: `${email} left the room.` }
        ]);
      }
    });

    return () => {
      socket.off("joined_room");
      socket.off("new_message");
      socket.off("user_joined");
      socket.off("user_left");
    };
  }, []);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const searchUsers = async (search) => {
    try {
      const response = await axios.get(`/api/users?search=${encodeURIComponent(search)}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setTargetEmail(value);
    if (value.trim().length > 0) {
      searchUsers(value.trim());
    } else {
      setUsers([]);
    }
  };

  const handleSelectUser = (email) => {
    setTargetEmail(email);
    setUsers([]);
  };

  const handleJoinRoom = async () => {
    if (!currentEmail.trim() || !targetEmail.trim()) {
      setStatus("Please enter both your email and the recipient email.");
      return;
    }

    if (currentEmail.trim().toLowerCase() === targetEmail.trim().toLowerCase()) {
      setStatus("You cannot join a personal room with your own email.");
      return;
    }

    try {
      await axios.post("/api/users", { email: currentEmail });
      await axios.post("/api/users", { email: targetEmail });
      const room = makeRoomId(currentEmail, targetEmail);
      setActiveRoomUser(targetEmail);
      setMessages([]);
      socket.emit("join_room", { roomId: room, email: currentEmail });
      setStatus(`Joining ${room} ...`);
    } catch (error) {
      console.error(error);
      setStatus("Could not join room. Check the server and try again.");
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!roomId) {
      setStatus("Join a room before sending messages.");
      return;
    }
    if (!newMessage.trim()) {
      return;
    }
    const payload = {
      roomId,
      message: newMessage.trim(),
      sender: currentEmail.trim().toLowerCase()
    };
    socket.emit("send_message", payload);
    setNewMessage("");
  };

  const handleLeaveRoom = () => {
    if (!roomId) {
      setStatus("No active room to leave.");
      return;
    }
    socket.emit("leave_room", { roomId });
    setStatus(`Left room ${roomId}`);
    setRoomId("");
    setActiveRoomUser("");
    setMessages([]);
  };

  return (
    <div className="page-shell">
      <div className="chat-card">
        <h1>Socket.IO Personal Messages</h1>
        <div className="field-group">
          <label>Your Email</label>
          <input
            value={currentEmail}
            onChange={(event) => setCurrentEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="field-group">
          <label>Search Recipient Email</label>
          <input
            value={targetEmail}
            onChange={handleSearchChange}
            placeholder="Search by email"
          />
          {users.length > 0 && (
            <div className="search-results">
              {users.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  className="search-result"
                  onClick={() => handleSelectUser(user.email)}
                >
                  {user.email}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="button-row">
          <button onClick={handleJoinRoom} className="primary-button">
            Join Room
          </button>
          <button onClick={handleLeaveRoom} className="secondary-button">
            Leave Room
          </button>
        </div>

        {roomId ? (
          <p className="status">Active room: {roomId} with {activeRoomUser}</p>
        ) : (
          <p className="status">No room joined yet.</p>
        )}

        <div className="messages-panel" ref={messagesRef}>
          {messages.length === 0 ? (
            <div className="empty-state">No messages yet. Send the first one.</div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.createdAt || index}-${index}`}
                className={message.system ? "message system" : message.sender === currentEmail.trim().toLowerCase() ? "message mine" : "message theirs"}
              >
                {message.system ? (
                  <em>{message.message}</em>
                ) : (
                  <>
                    <span className="message-sender">{message.sender}</span>
                    <span className="message-text">{message.message}</span>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="send-form">
          <input
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder="Type your message"
            disabled={!roomId}
          />
          <button type="submit" className="primary-button" disabled={!roomId}>
            Send
          </button>
        </form>

        <p className="status-message">{status}</p>
      </div>
    </div>
  );
}

export default App;
