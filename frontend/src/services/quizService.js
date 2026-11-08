import api from './api';

export const quizService = {
  generateQuiz: async (data) => {
    const res = await api.post('/quizzes/generate', data);
    return res.data;
  },

  getQuizzes: async (params = {}) => {
    const res = await api.get('/quizzes', { params });
    return res.data;
  },

  getQuizById: async (id) => {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  },

  submitQuiz: async (id, submission) => {
    const res = await api.post(`/quizzes/${id}/submit`, submission);
    return res.data;
  },

  getAttemptsHistory: async () => {
    const res = await api.get('/quizzes/attempts/history');
    return res.data;
  },

  deleteQuiz: async (id) => {
    const res = await api.delete(`/quizzes/${id}`);
    return res.data;
  },
};

export default quizService;
