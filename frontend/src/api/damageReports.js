import apiClient from './config';

// Get all damage reports
export const getAllDamageReports = async () => {
    const response = await apiClient.get('/damage-reports');
    return response.data;
};

// Get damage report by ID
export const getDamageReportById = async (id) => {
    const response = await apiClient.get(`/damage-reports/${id}`);
    return response.data;
};

// Get damage reports by user ID
export const getDamageReportsByUserId = async (userId) => {
    const response = await apiClient.get(`/damage-reports/user/${userId}`);
    return response.data;
};

// Get damage reports by vehicle ID
export const getDamageReportsByVehicleId = async (vehicleId) => {
    const response = await apiClient.get(`/damage-reports/vehicle/${vehicleId}`);
    return response.data;
};

// Get damage reports by status
export const getDamageReportsByStatus = async (status) => {
    const response = await apiClient.get(`/damage-reports/status/${status}`);
    return response.data;
};

// Create a new damage report
export const createDamageReport = async (reportData) => {
    const response = await apiClient.post('/damage-reports', reportData);
    return response.data;
};

// Update damage report status
export const updateDamageReportStatus = async (id, statusData) => {
    const response = await apiClient.put(`/damage-reports/${id}/status`, statusData);
    return response.data;
};

// Mark damage report as paid
export const markDamageReportPaid = async (id, razorpayPaymentId) => {
    const response = await apiClient.put(`/damage-reports/${id}/pay`, {
        razorpayPaymentId: razorpayPaymentId || 'OFFLINE_PAYMENT'
    });
    return response.data;
};
