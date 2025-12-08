import api from './api';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const createProfile = async (data) => {
  const response = await api.post('/profile', data);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.patch('/profile', data);
  return response.data;
};
