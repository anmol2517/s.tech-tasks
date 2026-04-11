const { useState, useEffect, useRef } = React;

function App() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    socketRef.current = io();

    socketRef.current.on('connect', () => {
      setConnected(true);
      setStatus('Connected to chat');
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      setStatus('Disconnected. Reconnect or refresh.');
    });

    socketRef.current.on('chatHistory', (history) => {
      setMessages(history);
    });

    socketRef.current.on('message', (message) => {
      setMessages((previous) => [...previous, message]);
    });

    socketRef.current.on('sendError', (error) => {
      setStatus(error.error || 'Send failed');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [joined]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (!name.trim()) {
      setStatus('Please enter your name to join.');
      return;
    }
    setJoined(true);
    setStatus('Joining chat...');
  };

  const postMessage = async (payload) => {
    if (!socketRef.current || !connected) {
      setStatus('Socket is not connected.');
      return;
    }
    socketRef.current.emit('sendMessage', payload);
    setMessage('');
  };

  const sendText = () => {
    if (!message.trim()) {
      setStatus('Type a message or upload a file.');
      return;
    }

    postMessage({
      sender: name,
      text: message.trim(),
      type: 'text',
      createdAt: new Date(),
    });
  };

  const uploadFile = async () => {
    if (!file) {
      setStatus('Choose a file to share.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading file...');
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { url, filename, mimetype, type } = response.data;
      postMessage({
        sender: name,
        text: filename,
        url,
        filename,
        mimetype,
        type,
        createdAt: new Date(),
      });
      setFile(null);
      setStatus('File uploaded successfully.');
    } catch (error) {
      console.error(error);
      setStatus('File upload failed. Check your AWS credentials and bucket settings.');
    }
  };

  const onFileChange = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;
    if (selected.size > 50 * 1024 * 1024) {
      setStatus('File is too large. Maximum 50MB allowed.');
      return;
    }
    setFile(selected);
    setStatus(`Selected file: ${selected.name}`);
  };

  const renderAttachment = (message) => {
    if (!message.url) return null;

    if (message.type === 'image') {
      return <img alt={message.filename} src={message.url} />;
    }

    if (message.type === 'video') {
      return (
        <video controls>
          <source src={message.url} type={message.mimetype} />
          Your browser does not support video playback.
        </video>
      );
    }

    if (message.type === 'audio') {
      return (
        <audio controls>
          <source src={message.url} type={message.mimetype} />
          Your browser does not support audio playback.
        </audio>
      );
    }

    return (
      <p className="file-preview">
        <a href={message.url} target="_blank" rel="noreferrer">
          Download {message.filename}
        </a>
      </p>
    );
  };

  if (!joined) {
    return (
      <div className="app-shell">
        <div className="side-panel login-panel">
          <h1>Group Chat</h1>
          <p>Enter your name to join the chat and share text, images, videos or files.</p>
          <input value={name} placeholder="Your display name" onChange={(e) => setName(e.target.value)} />
          <button onClick={handleJoin}>Join Chat</button>
          {status && <div className="alert">{status}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="chat-container">
        <div className="side-panel">
          <h2>Welcome, {name}</h2>
          <p>You are connected to the group chat.</p>
          <p>Status: {status}</p>
          <label className="send-file-button">
            Choose file
            <input type="file" style={{ display: 'none' }} onChange={onFileChange} />
          </label>
          {file && (
            <div className="file-preview">
              <strong>Ready to upload:</strong>
              <p>{file.name}</p>
            </div>
          )}
          <button className="send-file-button" onClick={uploadFile} disabled={!file}>Send File</button>
        </div>

        <div className="chat-panel">
          <h2>Live Chat</h2>
          <div className="message-list">
            {messages.map((msg) => (
              <div key={msg._id || `${msg.sender}-${msg.createdAt}`} className="message-item">
                <div className="sender">{msg.sender}</div>
                <div className="time">{new Date(msg.createdAt).toLocaleString()}</div>
                {msg.type === 'text' && <p>{msg.text}</p>}
                {msg.type !== 'text' && (
                  <React.Fragment>
                    <p>{msg.text}</p>
                    {renderAttachment(msg)}
                  </React.Fragment>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="message-input-row">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendText()}
            />
            <button onClick={sendText}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
