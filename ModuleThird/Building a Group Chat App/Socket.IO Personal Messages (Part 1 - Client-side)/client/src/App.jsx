import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import UserList from './components/UserList';
import Chat from './components/Chat';
import './App.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState('');

  const userList = useMemo(() => users.filter((user) => user.username !== currentUser?.username), [users, currentUser]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('joined_room', ({ roomId }) => {
      setRoomId(roomId);
    });

    return () => {
      socket.off('receive_message');
      socket.off('joined_room');
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Unable to load users', error);
    }
  };

  const handleLogin = async (username) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      setCurrentUser(data);
      fetchUsers();
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const createRoomId = (userA, userB) => {
    return [userA, userB].sort().join('_');
  };

  const handleSelectUser = async (user) => {
    if (!currentUser) return;

    const nextRoomId = createRoomId(currentUser.username, user.username);
    setSelectedUser(user);
    setMessages([]);
    socket.emit('join_room', { roomId: nextRoomId, username: currentUser.username });

    try {
      const response = await fetch(`${SERVER_URL}/api/messages/${nextRoomId}`);
      const data = await response.json();
      setMessages(data);
      setRoomId(nextRoomId);
    } catch (error) {
      console.error('Unable to load chat history', error);
    }
  };

  const handleSendMessage = (content) => {
    if (!currentUser || !selectedUser || !roomId) return;

    const payload = {
      roomId,
      sender: currentUser.username,
      receiver: selectedUser.username,
      content,
      timestamp: new Date().toISOString()
    };

    socket.emit('new_message', payload);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="profile-card">
          <strong>Logged in as</strong>
          <div>{currentUser.username}</div>
        </div>
        <UserList users={userList} onSelectUser={handleSelectUser} selectedUser={selectedUser} />
      </aside>
      <main className="chat-area">
        <Chat
          currentUser={currentUser}
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
}

export default App;
