import apiClient from './config';

// Get all payments
export const getAllPayments = async () => {
    const response = await apiClient.get('/payments');
    return response.data;
};

// Get payments by booking ID
export const getPaymentsByBookingId = async (bookingId) => {
    const response = await apiClient.get(`/payments/booking/${bookingId}`);
    return response.data;
};

// Record a new payment
export const recordPayment = async (paymentData) => {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
};

// Verify a payment
export const verifyPayment = async (razorpayPaymentId) => {
    const response = await apiClient.post('/payments/verify', { razorpayPaymentId });
    return response.data;
};
