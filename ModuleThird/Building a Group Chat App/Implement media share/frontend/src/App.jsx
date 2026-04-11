import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const socket = io(BACKEND_URL, { transports: ['websocket'] });

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('general');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('message', (incoming) => {
      setMessages((prev) => [...prev, incoming]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleJoin = () => {
    if (!username.trim()) return;
    socket.emit('joinRoom', { username, room });
    setJoined(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit('sendMessage', { username, room, text: message });
    setMessage('');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('room', room);

    try {
      setUploading(true);
      await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed, please check the console.');
    } finally {
      setUploading(false);
    }
  };

  const renderMessage = (msg, index) => {
    if (msg.type === 'system') {
      return (
        <div key={index} className="chat-message system-message">
          {msg.text}
        </div>
      );
    }

    if (msg.type === 'media') {
      const isImage = msg.fileType?.startsWith('image/');
      const isVideo = msg.fileType?.startsWith('video/');
      return (
        <div key={index} className="chat-message media-message">
          <div className="message-meta">
            <strong>{msg.sender}</strong> <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
          {isImage ? (
            <img src={msg.url} alt={msg.filename} />
          ) : isVideo ? (
            <video controls src={msg.url} />
          ) : (
            <a href={msg.url} target="_blank" rel="noreferrer">
              Download {msg.filename}
            </a>
          )}
        </div>
      );
    }

    return (
      <div key={index} className="chat-message">
        <div className="message-meta">
          <strong>{msg.sender}</strong> <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
        </div>
        <div>{msg.text}</div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <div className="card">
        <h1>Group Chat with Media Sharing</h1>
        {!joined ? (
          <div className="join-panel">
            <label>
              Your name
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" />
            </label>
            <label>
              Room name
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="general" />
            </label>
            <button onClick={handleJoin} disabled={!username.trim()}>
              Join Chat
            </button>
          </div>
        ) : (
          <div className="chat-panel">
            <div className="chat-info">
              <div>Room: <strong>{room}</strong></div>
              <div>User: <strong>{username}</strong></div>
            </div>
            <div className="messages">
              {messages.map(renderMessage)}
              <div ref={messageEndRef} />
            </div>
            <div className="composer">
              <textarea
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
              />
              <button onClick={handleSendMessage} disabled={!message.trim()}>
                Send
              </button>
            </div>
            <div className="upload-panel">
              <label className="file-input-label">
                Choose media file
                <input type="file" onChange={handleFileChange} />
              </label>
              <button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? 'Uploading…' : 'Upload & Share'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
