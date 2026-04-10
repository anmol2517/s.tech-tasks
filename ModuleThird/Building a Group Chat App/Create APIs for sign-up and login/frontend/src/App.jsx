import { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/auth';

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#2e7d32',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '15px',
};

const containerStyle = {
  maxWidth: '420px',
  margin: '40px auto',
  padding: '24px',
  boxShadow: '0 0 18px rgba(0,0,0,0.08)',
  borderRadius: '12px',
  fontFamily: 'Arial, sans-serif',
};

export default function App() {
  const [mode, setMode] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setEmailOrPhone('');
    setPassword('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (mode === 'signup') {
      if (!name || !email || !phone || !password) {
        setMessage('Fill all signup fields first.');
        return;
      }

      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();
      setMessage(data.message || 'Signup response received.');
      if (response.ok) {
        resetForm();
        setMode('login');
      }
      return;
    }

    if (!emailOrPhone || !password) {
      setMessage('Fill both email/phone and password.');
      return;
    }

    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrPhone, password }),
    });

    const data = await response.json();
    setMessage(data.message || 'Login response received.');

    if (response.ok) {
      setToken(data.token || '');
      resetForm();
    } else {
      setToken('');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Group Chat Auth</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>
        {mode === 'signup'
          ? 'Create a new account with name, email, phone and password.'
          : 'Login with your email or phone and password.'}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setMessage('');
            setToken('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: mode === 'signup' ? '#1976d2' : '#e0e0e0',
            color: mode === 'signup' ? '#fff' : '#111',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setMessage('');
            setToken('');
          }}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: mode === 'login' ? '#1976d2' : '#e0e0e0',
            color: mode === 'login' ? '#fff' : '#111',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <>
            <label>Name</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
            />
            <label>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
            />
            <label>Phone</label>
            <input
              style={inputStyle}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
            />
          </>
        )}

        {mode === 'login' && (
          <>
            <label>Email or Phone</label>
            <input
              style={inputStyle}
              type="text"
              value={emailOrPhone}
              onChange={(event) => setEmailOrPhone(event.target.value)}
              placeholder="Email or Phone"
            />
          </>
        )}

        <label>Password</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />

        <button type="submit" style={buttonStyle}>
          {mode === 'signup' ? 'Create Account' : 'Login'}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '18px',
            padding: '10px 14px',
            backgroundColor: '#f0f4ff',
            border: '1px solid #90caf9',
            borderRadius: '6px',
            color: '#0d47a1',
          }}
        >
          {message}
        </div>
      )}

      {token && (
        <div
          style={{
            marginTop: '18px',
            padding: '10px 14px',
            backgroundColor: '#e8f5e9',
            border: '1px solid #a5d6a7',
            borderRadius: '6px',
            color: '#1b5e20',
            wordBreak: 'break-all',
          }}
        >
          <strong>Token:</strong>
          <div style={{ marginTop: '10px' }}>{token}</div>
        </div>
      )}
    </div>
  );
}
