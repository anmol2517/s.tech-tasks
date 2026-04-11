import { useEffect, useRef, useState } from 'react';
import './Chat.css';

function Chat({ currentUser, selectedUser, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div>
          <h2>Personal Chat</h2>
          <p>{selectedUser ? `Chatting with ${selectedUser.username}` : 'Select a user to start a personal chat.'}</p>
        </div>
      </div>

      <div className="chat-body">
        {selectedUser ? (
          messages.map((message) => {
            const isMine = message.sender === currentUser.username;
            return (
              <div key={message._id || `${message.timestamp}-${message.content}`} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                <div className="message-bubble">
                  <div className="message-sender">{isMine ? 'You' : message.sender}</div>
                  <div>{message.content}</div>
                  <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-chat">Choose a user from the list to send a personal message.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={selectedUser ? 'Type a message...' : 'Select a user to chat'}
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          disabled={!selectedUser}
        />
        <button type="submit" disabled={!selectedUser || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
