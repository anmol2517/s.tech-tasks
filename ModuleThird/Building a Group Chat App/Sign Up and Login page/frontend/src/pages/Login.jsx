import React, { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsAuth, setShowLogin }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await login(formData.identifier, formData.password);
      if (result.success) {
        setMessage('Login successful! Redirecting...');
        setIsAuth(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identifier">Email or Phone Number</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="john@example.com or 9876543210"
            disabled={loading}
          />
          {errors.identifier && <div className="error">{errors.identifier}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={loading}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>

        {message && (
          <div className={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </div>
        )}
      </form>

      <div className="toggle-text">
        Don&apos;t have an account?{' '}
        <a onClick={() => setShowLogin(false)}>
          Sign Up
        </a>
      </div>
    </div>
  );
}
