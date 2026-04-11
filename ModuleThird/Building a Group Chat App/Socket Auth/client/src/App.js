import React, { useState } from 'react';
import RegisterLogin from './components/RegisterLogin';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Socket.IO Auth Chat</h1>
      {!token ? (
        <RegisterLogin onAuth={(auth) => {
          setToken(auth.token);
          setUser(auth.user);
        }} />
      ) : (
        <Chat token={token} user={user} />
      )}
    </div>
  );
}

export default App;
