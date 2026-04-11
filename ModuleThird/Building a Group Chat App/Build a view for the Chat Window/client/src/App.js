import React, { useEffect, useState, useRef } from 'react';
import ChatWindow from './components/ChatWindow';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('You');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Failed to load messages:', error));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage = { user, text: trimmed };
    setInput('');

    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });
      const saved = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, saved]);
      }
    } catch (error) {
      console.error('Could not send message', error);
    }
  };

  const submitOnEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-shell">
      <ChatWindow
        messages={messages}
        user={user}
        setUser={setUser}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onKeyDown={submitOnEnter}
      >
        <div ref={messagesEndRef} />
      </ChatWindow>
    </div>
  );
}

export default App;
