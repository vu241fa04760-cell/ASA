import api from './api';

export const progressService = {
  getDashboardData: async () => {
    const res = await api.get('/progress/dashboard');
    return res.data;
  },

  logStudyTime: async (data) => {
    const res = await api.post('/progress/log-study-time', data);
    return res.data;
  },
};

export default progressService;
