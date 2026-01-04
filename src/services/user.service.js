import api from './api';

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, { role });
  return response.data;
};

export const suspendUser = async (id) => {
  const response = await api.patch(`/users/${id}/suspend`);
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.patch(`/users/${id}/activate`);
  return response.data;
};

export const blockUser = async (id) => {
  const response = await api.patch(`/users/${id}/block`);
  return response.data;
};

export const unblockUser = async (id) => {
  const response = await api.patch(`/users/${id}/unblock`);
  return response.data;
};

export const getPlatformAnalytics = async () => {
  const response = await api.get('/users/analytics');
  return response.data;
};

