import api from './api';

export const documentService = {
  uploadDocument: async (formData) => {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getDocuments: async (params = {}) => {
    const res = await api.get('/documents', { params });
    return res.data;
  },

  getDocumentById: async (id) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
  },

  askQuestion: async (id, question) => {
    const res = await api.post(`/documents/${id}/ask`, { question });
    return res.data;
  },

  deleteDocument: async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },
};

export default documentService;
