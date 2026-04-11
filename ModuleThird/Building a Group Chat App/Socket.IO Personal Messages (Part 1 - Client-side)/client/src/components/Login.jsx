import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) return;
    onLogin(username.trim());
    setUsername('');
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Personal Chat Login</h1>
        <p>Enter your username to join the chat.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
