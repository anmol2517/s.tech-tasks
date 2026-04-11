const { useState, useEffect } = React;

function App() {
  const [userId, setUserId] = useState('user1');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages', error);
      setStatus('Unable to fetch messages from the server.');
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!userId.trim() || !text.trim()) {
      setStatus('Please add both user ID and message text.');
      return;
    }

    setStatus('Sending message...');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to send message');
      }

      const savedMessage = await response.json();
      setMessages((prev) => [...prev, savedMessage]);
      setText('');
      setStatus('Message saved!');
    } catch (error) {
      console.error(error);
      setStatus('Failed to save message.');
    }
  }

  return (
    <div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          placeholder="Type your message here"
        />
        <button type="submit">Send Message</button>
      </form>

      {status && <p className="status">{status}</p>}

      <div className="message-list">
        {messages.length === 0 ? (
          <div className="empty">No messages yet. Send one to store it in the database.</div>
        ) : (
          messages.map((message) => (
            <div key={message._id} className="message-item">
              <div className="meta">
                User: <strong>{message.userId}</strong> — {new Date(message.createdAt).toLocaleString()}
              </div>
              <div>{message.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
