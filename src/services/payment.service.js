import api from './api';

const createPayment = (data) => api.post('/payments', data);
const getPayments = () => api.get('/payments');
const updatePaymentStatus = (id, status) => api.patch(`/payments/${id}`, { status });

// Subscription endpoints
const createCheckoutSession = (data = {}) => api.post('/subscription/create-checkout', data);
const verifyPayment = (sessionId) => api.post('/subscription/verify-payment', { sessionId });
const getSubscriptionStatus = () => api.get('/subscription/status');
const getPremiumPriceInfo = () => api.get('/subscription/price');
const getAllSubscriptionsAdmin = () => api.get('/subscription/all');

const PaymentService = {
  createPayment,
  getPayments,
  updatePaymentStatus,
  // Subscription methods
  createCheckoutSession,
  verifyPayment,
  getSubscriptionStatus,
  getPremiumPriceInfo,
  getAllSubscriptionsAdmin,
};

export default PaymentService;

