import React from 'react';

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message, currentUser }) {
  const isMine = message.user === currentUser;

  return (
    <div className={`message-row ${isMine ? 'mine' : 'other'}`}>
      <div className={`message-bubble ${isMine ? 'mine' : 'other'}`}>
        <div className="message-top">
          <span className="message-user">{message.user}</span>
          <span className="message-time">{formatTime(message.createdAt)}</span>
        </div>
        <p>{message.text}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
