import apiClient, { setToken, setUser, clearAuth } from './config';

// Login user
export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', {
        email,
        password,
    });

    // Store token and user data
    if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
    }

    return response.data;
};

// Signup new user
export const signup = async (userData) => {
    const response = await apiClient.post('/auth/signup', {
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        role: userData.role || 'USER',
        phone: userData.phone,
    });

    // Store token and user data
    if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
    }

    return response.data;
};

// Get current user
export const getCurrentUser = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

// Logout user
export const logout = () => {
    clearAuth();
};

export const updateUserRole = async (email, role) => {
    const response = await apiClient.put(`/auth/update-role/${email}`, null, {
        params: { role }
    });
    return response.data;
};
export const forgotPassword = async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
};
