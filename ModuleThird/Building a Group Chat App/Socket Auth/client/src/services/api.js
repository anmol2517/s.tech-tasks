import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const registerUser = (payload) => API.post('/auth/register', payload).then((res) => res.data);
export const loginUser = (payload) => API.post('/auth/login', payload).then((res) => res.data);
export const getCurrentUser = (token) => API.get('/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((res) => res.data);
