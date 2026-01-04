import api from './api';

const getNotifications = async (isRead) => {
  const params = {};
  if (isRead !== undefined) {
    params.isRead = isRead;
  }
  return api.get('/notifications', { params });
};

const getUnreadCount = async () => {
  return api.get('/notifications/unread-count');
};

const markAsRead = async (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

const markAllAsRead = async () => {
  return api.patch('/notifications/mark-all-read');
};

const deleteNotification = async (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

const NotificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default NotificationService;
