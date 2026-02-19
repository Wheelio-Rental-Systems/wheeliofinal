import apiClient from './config';

// Upload a file
// Returns: { fileId: "uuid", message: "..." }
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Start file download
export const downloadFile = async (fileId, fileName = 'download') => {
    const response = await apiClient.get(`/files/${fileId}`, {
        responseType: 'blob', // Important for file downloads
    });

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
