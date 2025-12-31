import api from './api';

const getProjectActivity = async (projectId, filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.action) params.append('action', filters.action);
  if (filters.userId) params.append('userId', filters.userId);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.skip) params.append('skip', filters.skip.toString());

  return api.get(`/activity/project/${projectId}?${params.toString()}`);
};

const getUserActivity = async (userId, filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.action) params.append('action', filters.action);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.skip) params.append('skip', filters.skip.toString());

  return api.get(`/activity/user/${userId}?${params.toString()}`);
};

const getTaskActivity = async (taskId, projectId) => {
  return api.get(`/activity/task/${taskId}?projectId=${projectId}`);
};

const ActivityService = {
  getProjectActivity,
  getUserActivity,
  getTaskActivity,
};

export default ActivityService;
