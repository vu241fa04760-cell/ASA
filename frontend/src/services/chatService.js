import api from './api';

export const chatService = {
  sendMessage: async (data) => {
    const res = await api.post('/chat/message', data);
    return res.data;
  },

  getSessions: async () => {
    const res = await api.get('/chat/sessions');
    return res.data;
  },

  getSessionById: async (id) => {
    const res = await api.get(`/chat/sessions/${id}`);
    return res.data;
  },

  createSession: async (data) => {
    const res = await api.post('/chat/sessions', data);
    return res.data;
  },

  deleteSession: async (id) => {
    const res = await api.delete(`/chat/sessions/${id}`);
    return res.data;
  },
};

export default chatService;
