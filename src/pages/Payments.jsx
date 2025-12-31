import React, { useEffect, useState } from 'react';
import PaymentService from '../services/payment.service';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await PaymentService.getPayments();
      setPayments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id) => {
    try {
      await PaymentService.updatePaymentStatus(id, 'completed');
      alert('Payment processed successfully (Mock)');
      fetchPayments();
    } catch (error) {
      alert('Payment failed');
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payee
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Task
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">No payments found</td>
                </tr>
            ) : (
                payments.map((payment) => (
                <tr key={payment._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{payment.payeeId?.name || payment.payeeId}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{payment.taskId?.title || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{payment.amount} {payment.currency}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold text-${payment.status === 'completed' ? 'green' : 'orange'}-900 leading-tight`}>
                        <span aria-hidden className={`absolute inset-0 bg-${payment.status === 'completed' ? 'green' : 'orange'}-200 opacity-50 rounded-full`}></span>
                        <span className="relative">{payment.status}</span>
                    </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {payment.status !== 'completed' && (
                        <button
                        onClick={() => handlePay(payment._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        >
                        Pay
                        </button>
                    )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
