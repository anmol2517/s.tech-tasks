import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/messages');
      if (!response.ok) {
        throw new Error('Unable to load messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Group Chat</h1>
        <p>Messages are loaded from the database when the page opens.</p>
      </header>

      <main className="chat-area">
        {loading && <div className="status">Loading messages...</div>}
        {error && <div className="status error">{error}</div>}
        {!loading && !error && messages.length === 0 && (
          <div className="status">No messages yet.</div>
        )}

        <ul className="message-list">
          {messages.map((message) => (
            <li key={message._id} className="message-card">
              <div className="message-meta">
                <strong>User {message.senderId}</strong>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </div>
              <p>{message.text}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
