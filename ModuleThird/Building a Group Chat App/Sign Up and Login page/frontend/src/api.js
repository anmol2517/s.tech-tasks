import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const signup = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (identifier, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    identifier,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
