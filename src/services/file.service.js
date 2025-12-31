import api from './api';

const uploadFile = async (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/files/upload/${taskId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const downloadFile = async (fileId, taskId, filename) => {
  const response = await api.get(`/files/${fileId}?taskId=${taskId}`, {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const deleteFile = async (fileId, taskId) => {
  return api.delete(`/files/${fileId}?taskId=${taskId}`);
};

const FileService = {
  uploadFile,
  downloadFile,
  deleteFile,
};

export default FileService;
