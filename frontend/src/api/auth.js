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
