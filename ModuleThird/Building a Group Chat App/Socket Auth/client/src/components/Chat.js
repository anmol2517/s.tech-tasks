import React, { useEffect, useState, useRef } from 'react';
import { createSocket } from '../services/socket';

const Chat = ({ token, user }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const messageRef = useRef(null);

  useEffect(() => {
    const socketClient = createSocket(token);
    setSocket(socketClient);

    socketClient.on('connect', () => {
      setStatus('Connected');
    });

    socketClient.on('welcome', (data) => {
      setMessages((prev) => [...prev, { ...data, system: true }]);
    });

    socketClient.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketClient.on('connect_error', (err) => {
      setStatus(`Connection error: ${err.message}`);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('sendMessage', input.trim());
    setInput('');
  };

  return (
    <div style={{ maxWidth: 700, marginTop: 24 }}>
      <div>
        <strong>{user.name}</strong> ({user.email})
      </div>
      <div>Status: {status}</div>

      <div style={{ marginTop: 24, border: '1px solid #ccc', padding: 12, minHeight: 320, background: '#f9f9f9' }}>
        {messages.length === 0 && <div>No messages yet.</div>}
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            {msg.system ? (
              <em>{msg.message}</em>
            ) : (
              <div>
                <strong>{msg.user?.name || 'Unknown'}</strong>: {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messageRef} />
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
          placeholder="Type a message..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
