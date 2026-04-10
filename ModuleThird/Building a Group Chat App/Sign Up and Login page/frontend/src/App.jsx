import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './api';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              <Navigate to="/dashboard" />
            ) : showLogin ? (
              <Login setIsAuth={setIsAuth} setShowLogin={setShowLogin} />
            ) : (
              <Signup setIsAuth={setIsAuth} setShowLogin={setShowLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard setIsAuth={setIsAuth} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
