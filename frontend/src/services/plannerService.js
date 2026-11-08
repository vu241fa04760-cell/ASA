import api from './api';

export const plannerService = {
  getTasks: async (params = {}) => {
    const res = await api.get('/planner/tasks', { params });
    return res.data;
  },

  createTask: async (taskData) => {
    const res = await api.post('/planner/tasks', taskData);
    return res.data;
  },

  updateTask: async (id, taskData) => {
    const res = await api.put(`/planner/tasks/${id}`, taskData);
    return res.data;
  },

  toggleTaskStatus: async (id) => {
    const res = await api.patch(`/planner/tasks/${id}/toggle`);
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await api.delete(`/planner/tasks/${id}`);
    return res.data;
  },
};

export default plannerService;
