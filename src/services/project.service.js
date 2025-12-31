import api from './api';

const createProject = (data) => api.post('/projects', data);
const getAllProjects = () => api.get('/projects');
const getProjectById = (id) => api.get(`/projects/${id}`);
const getDashboardStats = () => api.get('/projects/dashboard-stats');

// Assuming axios and API_URL are available in the scope, or need to be imported/defined.
// For this change, I'm adding the function as provided, but noting the dependency.
// If axios and API_URL are not globally available or imported, this will cause a reference error.
const addTeamMember = async (projectId, userId) => {
    const response = await api.post(`/projects/${projectId}/team`, { userId });
    return response.data;
};

const ProjectService = {
  createProject,
  getAllProjects,
  getProjectById,
  getDashboardStats,
  addTeamMember,
};

export default ProjectService;
