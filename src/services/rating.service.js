import api from './api';

const submitRating = async (ratingData) => {
  return api.post('/ratings', ratingData);
};

const getUserRatings = async (userId, params = {}) => {
  return api.get(`/ratings/user/${userId}`, { params });
};

const getRatingsGiven = async () => {
  return api.get('/ratings/given');
};

const getRatingsReceived = async () => {
  return api.get('/ratings/received');
};

const checkIfRated = async (entityType, entityId) => {
  return api.get(`/ratings/check/${entityType}/${entityId}`);
};

const RatingService = {
  submitRating,
  getUserRatings,
  getRatingsGiven,
  getRatingsReceived,
  checkIfRated,
};

export default RatingService;
