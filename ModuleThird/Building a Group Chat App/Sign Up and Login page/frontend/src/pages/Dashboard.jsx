import React from 'react';
import { logout, getUser } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ setIsAuth }) {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>
      <div className="user-info">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
