import api from './api';

export const notesService = {
  generateNotes: async (data) => {
    const res = await api.post('/notes/generate', data);
    return res.data;
  },

  createNote: async (noteData) => {
    const res = await api.post('/notes', noteData);
    return res.data;
  },

  getNotes: async (params = {}) => {
    const res = await api.get('/notes', { params });
    return res.data;
  },

  getNoteById: async (id) => {
    const res = await api.get(`/notes/${id}`);
    return res.data;
  },

  updateNote: async (id, noteData) => {
    const res = await api.put(`/notes/${id}`, noteData);
    return res.data;
  },

  deleteNote: async (id) => {
    const res = await api.delete(`/notes/${id}`);
    return res.data;
  },

  togglePin: async (id) => {
    const res = await api.patch(`/notes/${id}/pin`);
    return res.data;
  },
};

export default notesService;
