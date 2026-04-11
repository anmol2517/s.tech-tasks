import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';

const RegisterLogin = ({ onAuth }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = { email, password, ...(mode === 'register' ? { name } : {}) };
      const data = mode === 'register'
        ? await registerUser(payload)
        : await loginUser(payload);
      onAuth(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ maxWidth: 420, marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>Login</button>
        <button onClick={() => setMode('register')} disabled={mode === 'register'} style={{ marginLeft: 8 }}>Register</button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div style={{ marginBottom: 12 }}>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      </form>
    </div>
  );
};

export default RegisterLogin;
