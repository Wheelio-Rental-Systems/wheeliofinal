import apiClient from './config';

// Get all drivers
export const getAllDrivers = async () => {
    const response = await apiClient.get('/drivers');
    return response.data;
};

export const getDriverProfile = async (userId) => {
    const response = await apiClient.get(`/drivers/${userId}`);
    return response.data;
};

export const updateDriverProfile = async (userId, data) => {
    const response = await apiClient.put(`/drivers/${userId}`, data);
    return response.data;
};

export const createDriverProfile = async (data) => {
    const response = await apiClient.post('/drivers', data);
    return response.data;
};

export const getAvailableDrivers = async (city) => {
    const response = await apiClient.get('/drivers/available', {
        params: { city }
    });
    return response.data;
};
