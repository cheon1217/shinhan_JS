import axios from 'axios';

export const sendCode = (email) =>
  axios.post('/api/auth/send-code', { email });

export const signup = (email, password, code) =>
  axios.post('/api/auth/signup', { email, password, code });

export const login = (username, password) =>
  axios.post('/api/auth/login', { username, password });