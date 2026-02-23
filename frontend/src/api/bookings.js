import apiClient from './config';

// Create new booking
export const createBooking = async (bookingData) => {
    const response = await apiClient.post('/bookings', {
        ...bookingData
    });
    return response.data;
};

// Get all bookings
export const getAllBookings = async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
};

// Get booking by ID
export const getBookingById = async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
};

// Get bookings by user ID
export const getUserBookings = async (userId) => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
};

// Get bookings by vehicle ID
export const getVehicleBookings = async (vehicleId) => {
    const response = await apiClient.get(`/bookings/vehicle/${vehicleId}`);
    return response.data;
};

// Get bookings by driver ID
export const getDriverBookings = async (driverId) => {
    const response = await apiClient.get(`/bookings/driver/${driverId}`);
    return response.data;
};

// Update booking status
export const updateBookingStatus = async (id, bookingStatus, paymentStatus) => {
    const response = await apiClient.put(`/bookings/${id}/status`, {
        bookingStatus,
        paymentStatus,
    });
    return response.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
};

// Get booked dates for a vehicle
export const getBookedDates = async (vehicleId) => {
    const response = await apiClient.get(`/bookings/vehicle/${vehicleId}/booked-dates`);
    return response.data;
};
