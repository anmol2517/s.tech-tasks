import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true
});

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('Guest');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${SOCKET_URL}/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Failed to load messages', err));

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server', socket.id);
      socket.emit('join-room', 'public');
    });

    socket.on('receive-message', (message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    socket.emit('send-message', {
      username,
      text
    });
    setText('');
  };

  return (
    <div className="app-shell">
      <div className="chat-card">
        <header className="chat-header">
          <h1>Socket.IO Group Chat</h1>
          <p>Connected to {SOCKET_URL}</p>
        </header>

        <div className="chat-controls">
          <label>
            Name
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your name"
            />
          </label>
        </div>

        <div className="message-list">
          {messages.map((message) => (
            <div key={message._id || `${message.username}-${message.createdAt}`} className="message-item">
              <span className="message-meta">
                <strong>{message.username}</strong>
                <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
              </span>
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
