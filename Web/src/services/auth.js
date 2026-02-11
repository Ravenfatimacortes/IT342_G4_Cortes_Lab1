
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const tokenKey = 'token';

export async function register(email, password) {
  try {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    return res.data;
  } catch (e) {
    throw new Error(e?.response?.data?.error || 'Registration failed');
  }
}

export async function login(email, password) {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    const token = res.data?.token;
    if (!token) throw new Error('No token received');
    localStorage.setItem(tokenKey, token);
    return res.data;
  } catch (e) {
    throw new Error(e?.response?.data?.error || 'Login failed');
  }
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function isAuthenticated() {
  return !!localStorage.getItem(tokenKey);
}

export async function getProfile() {
  try {
    const token = localStorage.getItem(tokenKey);
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    throw new Error('Failed to fetch profile');
  }
}
