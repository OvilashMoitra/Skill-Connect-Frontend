import api from './api';

const createPayment = (data) => api.post('/payments', data);
const getPayments = () => api.get('/payments');
const updatePaymentStatus = (id, status) => api.patch(`/payments/${id}`, { status });

const PaymentService = {
  createPayment,
  getPayments,
  updatePaymentStatus,
};

export default PaymentService;
