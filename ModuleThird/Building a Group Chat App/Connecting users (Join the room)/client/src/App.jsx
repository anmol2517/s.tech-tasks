import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { checkUserExists, generateRoomId } from './api';

const socket = io('http://localhost:5000');

function App() {
  const [currentEmail, setCurrentEmail] = useState('alice@example.com');
  const [otherEmail, setOtherEmail] = useState('bob@example.com');
  const [roomId, setRoomId] = useState('');
  const [status, setStatus] = useState('Enter emails and validate the other user.');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [joined, setJoined] = useState(false);
  const [recipientExists, setRecipientExists] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const messageEndRef = useRef(null);

  const computedRoomId = useMemo(() => generateRoomId(currentEmail, otherEmail), [currentEmail, otherEmail]);

  useEffect(() => {
    socket.on('user_joined', ({ email }) => {
      setMessages(prev => [...prev, { sender: 'SYSTEM', message: `${email} joined the room.` }]);
    });

    socket.on('receive_message', payload => {
      setMessages(prev => [...prev, payload]);
    });

    return () => {
      socket.off('user_joined');
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleValidateRecipient = async () => {
    try {
      setIsValidating(true);
      setStatus('Validating recipient email...');
      const result = await checkUserExists(otherEmail);
      if (result.exists) {
        setRecipientExists(true);
        setStatus('Recipient email is valid. You can join the room.');
      } else {
        setRecipientExists(false);
        setStatus('Recipient email not found. Please use a registered email.');
      }
    } catch (error) {
      setStatus('Error validating recipient. Check server connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!recipientExists) {
      setStatus('Please validate the recipient email before joining.');
      return;
    }

    const normalizedCurrent = currentEmail.trim().toLowerCase();
    const normalizedOther = otherEmail.trim().toLowerCase();

    if (!normalizedCurrent || !normalizedOther) {
      setStatus('Both email fields are required to join a room.');
      return;
    }

    const room = generateRoomId(normalizedCurrent, normalizedOther);
    setRoomId(room);
    socket.emit('join_room', { roomId: room, email: normalizedCurrent });
    setJoined(true);
    setStatus(`Joined room ${room}. Start messaging below.`);
  };

  const handleSendMessage = event => {
    event.preventDefault();
    if (!messageText.trim()) return;
    if (!roomId) {
      setStatus('Join a room first before sending messages.');
      return;
    }

    const payload = {
      roomId,
      sender: currentEmail.trim().toLowerCase(),
      message: messageText.trim()
    };

    socket.emit('send_message', payload);
    setMessages(prev => [...prev, { ...payload, timestamp: new Date().toISOString() }]);
    setMessageText('');
  };

  return (
    <div className="app-shell">
      <header>
        <div>
          <h1>MERN Chat: Join Personal Room</h1>
          <p>Unique room IDs are built by sorting both emails alphabetically.</p>
        </div>
      </header>

      <section className="card">
        <div className="form-grid">
          <label>
            Your email
            <input
              type="email"
              value={currentEmail}
              onChange={e => setCurrentEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>
          <label>
            Chat with
            <input
              type="email"
              value={otherEmail}
              onChange={e => {
                setOtherEmail(e.target.value);
                setRecipientExists(false);
              }}
              placeholder="Enter recipient email"
            />
          </label>
        </div>

        <div className="controls">
          <button onClick={handleValidateRecipient} disabled={isValidating || !otherEmail.trim()}>
            {isValidating ? 'Validating...' : 'Validate Recipient'}
          </button>
          <button onClick={handleJoinRoom} disabled={!recipientExists}>
            Join Room
          </button>
        </div>

        <div className="status-panel">
          <strong>Status:</strong> {status}
        </div>

        <div className="room-info">
          <p><strong>Computed Room ID:</strong> {computedRoomId || 'waiting for emails'}</p>
          <p><strong>Recipient valid:</strong> {recipientExists ? 'Yes' : 'No'}</p>
          <p><strong>Joined room:</strong> {joined ? 'Yes' : 'No'}</p>
        </div>
      </section>

      <section className="chat-card">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender === currentEmail.trim().toLowerCase() ? 'mine' : msg.sender === 'SYSTEM' ? 'system' : 'theirs'}`}>
              <div className="chat-meta">
                <span>{msg.sender}</span>
                <small>{new Date(msg.timestamp || Date.now()).toLocaleTimeString()}</small>
              </div>
              <div>{msg.message}</div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            placeholder={joined ? 'Type your message here...' : 'Join a room first to send messages.'}
            disabled={!joined}
          />
          <button type="submit" disabled={!joined || !messageText.trim()}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
