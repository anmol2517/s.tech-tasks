import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const getChats = () => api.get('/chats');
export const getArchivedChats = () => api.get('/chats/archived');
export const sendMessage = (payload) => api.post('/chats', payload);
export const runArchiveJob = () => api.get('/archive/run');
