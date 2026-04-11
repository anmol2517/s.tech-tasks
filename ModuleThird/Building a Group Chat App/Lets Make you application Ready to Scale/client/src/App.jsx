import { useEffect, useMemo, useRef, useState } from 'react';
import { getChats, getArchivedChats, sendMessage, runArchiveJob } from './api';

const initialSender = `User${Math.floor(Math.random() * 900 + 100)}`;

function App() {
  const [sender, setSender] = useState(initialSender);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [archived, setArchived] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(false);
  const [archivedMode, setArchivedMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const listRef = useRef(null);

  const roomLabel = useMemo(() => archivedMode ? 'Archived Messages' : 'Live Chat', [archivedMode]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = archivedMode ? await getArchivedChats() : await getChats();
      setMessages(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setStatus('Connected');
      setLoading(false);
    } catch (error) {
      setStatus('Unable to load messages');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 3000);
    return () => clearInterval(timer);
  }, [archivedMode]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    try {
      await sendMessage({ sender, message });
      setMessage('');
      await loadMessages();
    } catch (error) {
      setStatus('Send failed');
    }
  };

  const handleArchive = async () => {
    try {
      setStatus('Archiving old messages...');
      await runArchiveJob();
      await loadMessages();
      setStatus('Archive complete');
    } catch (error) {
      setStatus('Archive failed');
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Scale Chat</div>
        <p>Send fast messages and keep the live chat table light with nightly archiving.</p>
        <div className="status">Status: {status}</div>
        <div className="controls">
          <button onClick={() => setArchivedMode(false)} className={!archivedMode ? 'active' : ''}>Live Chat</button>
          <button onClick={() => setArchivedMode(true)} className={archivedMode ? 'active' : ''}>Archived</button>
          <button onClick={handleArchive} className="archive-btn">Run Archive Now</button>
        </div>
        <div className="meta">
          <div>{roomLabel}</div>
          <div>Last refresh: {lastUpdated || 'pending'}</div>
          <div>Messages: {messages.length}</div>
        </div>
      </aside>

      <main>
        <section className="chat-panel">
          <header>
            <div>{roomLabel}</div>
            <div className="summary">Archive older than 1 day nightly to keep chat fast.</div>
          </header>

          <div className="message-list" ref={listRef}>
            {loading ? <div className="empty-state">Loading messages...</div> : null}
            {!loading && messages.length === 0 ? (
              <div className="empty-state">No messages yet.</div>
            ) : (
              messages.map((chat) => (
                <article key={chat._id} className="message-card">
                  <div className="message-author">{chat.sender}</div>
                  <div className="message-body">{chat.message}</div>
                  <div className="message-meta">
                    {new Date(chat.createdAt || chat.archivedAt).toLocaleString()}
                  </div>
                </article>
              ))
            )}
          </div>

          {!archivedMode ? (
            <form className="message-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={sender}
                onChange={(event) => setSender(event.target.value)}
                placeholder="Your name"
                maxLength={50}
              />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write a message..."
                rows={3}
                maxLength={1000}
              />
              <button type="submit">Send Message</button>
            </form>
          ) : (
            <div className="archived-note">Archived chat is read-only. Use live chat mode to send new messages.</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
