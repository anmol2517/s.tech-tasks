import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('global');
  const [isJoined, setIsJoined] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [status, setStatus] = useState('Waiting to connect...');
  const socket = useMemo(
    () => io(BACKEND_URL, {
      autoConnect: false,
      transports: ['websocket'],
    }),
    []
  );
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      setStatus('Connected to chat server');
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('notification', (notification) => {
      setMessages((prev) => [...prev, { ...notification, system: true }]);
    });

    socket.on('typing', ({ username: userTyping }) => {
      setTypingUsers((prev) => (prev.includes(userTyping) ? prev : [...prev, userTyping]));
    });

    socket.on('stopTyping', ({ username: userTyping }) => {
      setTypingUsers((prev) => prev.filter((user) => user !== userTyping));
    });

    socket.on('disconnect', () => {
      setStatus('Disconnected from chat server');
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [socket]);

  useEffect(() => {
    if (!isJoined) {
      return;
    }

    fetch(`${BACKEND_URL}/api/messages?room=${encodeURIComponent(room)}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch(() => {
        setStatus('Unable to load chat history');
      });
  }, [isJoined, room]);

  const joinChat = (event) => {
    event.preventDefault();

    if (!username.trim()) {
      return;
    }

    socket.connect();
    socket.emit('joinRoom', { username, room });
    setIsJoined(true);
    setStatus(`Joined room ${room}`);
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const trimmedText = messageText.trim();
    if (!trimmedText) {
      return;
    }

    const payload = {
      sender: username,
      text: trimmedText,
      room,
    };

    socket.emit('sendMessage', payload);
    setMessageText('');
    socket.emit('stopTyping', { username, room });
  };

  const handleTyping = (event) => {
    setMessageText(event.target.value);

    if (!isJoined) {
      return;
    }

    socket.emit('typing', { username, room });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { username, room });
    }, 1000);
  };

  return (
    <div className="app-shell">
      <div className="chat-panel">
        <header className="chat-header">
          <h1>Socket.IO Group Chat</h1>
          <p>{status}</p>
        </header>

        {!isJoined ? (
          <form className="join-form" onSubmit={joinChat}>
            <label>
              Name
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>
            <label>
              Room
              <input
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                placeholder="global"
              />
            </label>
            <button type="submit">Join Chat</button>
          </form>
        ) : (
          <>
            <section className="message-list" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message._id || index}-${message.createdAt || index}`}
                  className={message.system ? 'message system-message' : 'message'}
                >
                  {message.system ? (
                    <em>{message.text}</em>
                  ) : (
                    <>
                      <strong>{message.sender}:</strong> {message.text}
                    </>
                  )}
                </div>
              ))}
            </section>

            <div className="typing-indicator">
              {typingUsers.length > 0 && (
                <p>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</p>
              )}
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <input
                value={messageText}
                onChange={handleTyping}
                placeholder="Type a message..."
                autoComplete="off"
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
