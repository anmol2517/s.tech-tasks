import React from 'react';
import MessageBubble from './MessageBubble';

function ChatWindow({ messages, user, setUser, input, setInput, onSend, onKeyDown, children }) {
  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Group Chat</h2>
          <p>Build a chat window UI with MERN</p>
        </div>
        <div className="sidebar-user-card">
          <label htmlFor="username">Your name</label>
          <input
            id="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Type your name"
          />
        </div>
        <div className="sidebar-info">
          <p>Real-time style layout</p>
          <p>Scroll friendly message feed</p>
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          <div>
            <h3>Chat Window</h3>
            <span>WhatsApp-inspired message layout</span>
          </div>
          <div className="status-pill">Active now</div>
        </div>

        <div className="message-list" id="message-list">
          {messages.length === 0 ? (
            <div className="empty-state">Start the conversation with a message below.</div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message._id || message.createdAt} message={message} currentUser={user} />
            ))
          )}
          {children}
        </div>

        <div className="chat-input-panel">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
          />
          <button className="send-button" onClick={onSend}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default ChatWindow;
