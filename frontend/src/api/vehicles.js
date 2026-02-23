import apiClient from './config';

// Get all vehicles
export const getAllVehicles = async () => {
    const response = await apiClient.get('/vehicles');
    return response.data;
};

// Get vehicle by ID
export const getVehicleById = async (id) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
};

// Get available vehicles
export const getAvailableVehicles = async () => {
    const response = await apiClient.get('/vehicles/available');
    return response.data;
};

// Create new vehicle (admin only)
export const createVehicle = async (vehicleData) => {
    const response = await apiClient.post('/vehicles', vehicleData);
    return response.data;
};

// Update vehicle (admin only)
export const updateVehicle = async (id, vehicleData) => {
    const response = await apiClient.put(`/vehicles/${id}`, vehicleData);
    return response.data;
};

// Delete vehicle (admin only)
export const deleteVehicle = async (id) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
};
