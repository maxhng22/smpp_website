// src/services/apiClient.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3004/', // Replace with your API base URL
  timeout: 120000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here if needed
// For example, adding a token to the headers before each request
apiClient.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;