import apiClient from './../apiClient';

export const login = async (username, password) => {
    return apiClient.post('/api/login', { username, password });
  };
  
  export const register = async (username, password) => {
    return apiClient.post('/updateconfiguration', {username, password});
  };