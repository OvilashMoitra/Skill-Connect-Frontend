import api from './api';

const createMilestone = async (projectId, milestoneData) => {
  return api.post(`/milestones/${projectId}`, milestoneData);
};

const getMilestones = async (projectId) => {
  return api.get(`/milestones/${projectId}`);
};

const updateMilestone = async (projectId, milestoneId, updateData) => {
  return api.patch(`/milestones/${projectId}/${milestoneId}`, updateData);
};

const deleteMilestone = async (projectId, milestoneId) => {
  return api.delete(`/milestones/${projectId}/${milestoneId}`);
};

const MilestoneService = {
  createMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone,
};

export default MilestoneService;
