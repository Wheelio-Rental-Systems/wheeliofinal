import apiClient from './config';
import { setUser, getUser } from './config';

// Get user by ID
export const getUserById = async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
};

// Update user profile
export const updateUser = async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);

    // Update local storage if the updated user is the current user
    const currentUser = getUser();
    if (currentUser && currentUser.id === userId) {
        // Merge updates with existing user data to preserve token etc if any (though user data in LS doesn't have token)
        const updatedUser = { ...currentUser, ...response.data };
        setUser(updatedUser);
    }

    return response.data;
};
