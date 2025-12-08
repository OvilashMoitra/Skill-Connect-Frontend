import api from './api';

export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  if (response.data.success) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
  }
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};
