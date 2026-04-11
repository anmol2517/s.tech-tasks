import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

function App() {
  const [username, setUsername] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedName = localStorage.getItem('chatUsername');
    if (storedName) {
      setUsername(storedName);
    }

    fetch('http://localhost:4000/api/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Failed to load messages:', err));
  }, []);

  useEffect(() => {
    if (!username) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveUsername = () => {
    if (!username.trim()) return;
    localStorage.setItem('chatUsername', username.trim());
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim() || !username.trim()) return;

    const payload = { username: username.trim(), text: messageText.trim() };

    try {
      setMessageText('');
      await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Live Group Chat</h1>
        <p>{connected ? 'Connected live' : 'Waiting for connection...'}</p>
      </header>

      <main>
        <section className="sidebar">
          <label>
            Your name
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={saveUsername}
              placeholder="Enter a display name"
            />
          </label>
          <p>Give yourself a name, then send messages. All users see messages instantly.</p>
        </section>

        <section className="chat-box">
          <div className="messages">
            {messages.map((message) => (
              <div key={message._id || message.createdAt} className="message-item">
                <span className="message-user">{message.username}</span>
                <span className="message-time">{new Date(message.createdAt).toLocaleTimeString()}</span>
                <p>{message.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-form" onSubmit={sendMessage}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              disabled={!username.trim()}
            />
            <button type="submit" disabled={!messageText.trim() || !username.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
