// API Service for Wheelio Backend
const API_BASE_URL = '/api';

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('wheelio_token');

// Set JWT token in localStorage
const setToken = (token) => localStorage.setItem('wheelio_token', token);

// Remove JWT token
const removeToken = () => localStorage.removeItem('wheelio_token');

// Get current user from localStorage
const getCurrentUser = () => {
    const userStr = localStorage.getItem('wheelio_user');
    return userStr ? JSON.parse(userStr) : null;
};

// Set current user in localStorage
const setCurrentUser = (user) => {
    localStorage.setItem('wheelio_user', JSON.stringify(user));
};

// Remove current user
const removeCurrentUser = () => {
    localStorage.removeItem('wheelio_user');
};

// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
export const authAPI = {
    signup: async (userData) => {
        const response = await apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (response.token) {
            setToken(response.token);
            setCurrentUser(response.user);
        }

        return response;
    },

    login: async (email, password) => {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.token) {
            setToken(response.token);
            setCurrentUser(response.user);
        }

        return response;
    },

    logout: () => {
        removeToken();
        removeCurrentUser();
    },

    getCurrentUser: async () => {
        try {
            const response = await apiCall('/auth/me');
            setCurrentUser(response);
            return response;
        } catch (error) {
            removeToken();
            removeCurrentUser();
            throw error;
        }
    },

    isAuthenticated: () => {
        return !!getToken();
    },

    getUser: () => {
        return getCurrentUser();
    }
};

// Vehicles API
export const vehiclesAPI = {
    getAll: () => apiCall('/vehicles'),
    getById: (id) => apiCall(`/vehicles/${id}`),
    getAvailable: () => apiCall('/vehicles/available'),
};

// Bookings API
export const bookingsAPI = {
    create: (bookingData) => apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    }),
    getAll: () => apiCall('/bookings'),
    getById: (id) => apiCall(`/bookings/${id}`),
    getByUser: (userId) => apiCall(`/bookings/user/${userId}`),
    updateStatus: (id, status) => apiCall(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(status),
    }),
    cancel: (id) => apiCall(`/bookings/${id}`, {
        method: 'DELETE',
    }),
};

// Drivers API
export const driversAPI = {
    getAll: () => apiCall('/drivers'),
    getAvailable: () => apiCall('/drivers/available'),
    getById: (userId) => apiCall(`/drivers/${userId}`),
    update: (userId, profileData) => apiCall(`/drivers/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),
};

// Payments API
export const paymentsAPI = {
    create: (paymentData) => apiCall('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
    }),
    getByBooking: (bookingId) => apiCall(`/payments/booking/${bookingId}`),
    verify: (paymentId) => apiCall('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({ razorpayPaymentId: paymentId }),
    }),
};

// Damage Reports API
export const damageReportsAPI = {
    create: (reportData) => apiCall('/damage-reports', {
        method: 'POST',
        body: JSON.stringify(reportData),
    }),
    getAll: () => apiCall('/damage-reports'),
    getById: (id) => apiCall(`/damage-reports/${id}`),
    getByVehicle: (vehicleId) => apiCall(`/damage-reports/vehicle/${vehicleId}`),
    updateStatus: (id, status) => apiCall(`/damage-reports/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(status),
    }),
};

export default {
    auth: authAPI,
    vehicles: vehiclesAPI,
    bookings: bookingsAPI,
    drivers: driversAPI,
    payments: paymentsAPI,
    damageReports: damageReportsAPI,
};
