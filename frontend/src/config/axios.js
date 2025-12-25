import axios from 'axios';

// Create axios instance with base URL
const baseURL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://school-erp-backend-i9z5.onrender.com');
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default api;
