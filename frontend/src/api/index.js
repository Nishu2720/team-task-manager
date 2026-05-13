import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  signup:         (data)  => api.post('/auth/signup', data),
  login:          (data)  => api.post('/auth/login',  data),
  me:             ()      => api.get('/auth/me'),
  updateMe:       (data)  => api.patch('/auth/me',    data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password',  data),
};

export const projectsApi = {
  list:         ()           => api.get('/projects'),
  get:          (id)         => api.get(`/projects/${id}`),
  create:       (data)       => api.post('/projects', data),
  update:       (id, data)   => api.patch(`/projects/${id}`, data),
  delete:       (id)         => api.delete(`/projects/${id}`),
  addMember:    (id, email)  => api.post(`/projects/${id}/members`, { email }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

export const tasksApi = {
  list:          (params)            => api.get('/tasks', { params }),
  listByProject: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  create:        (projectId, data)   => api.post(`/projects/${projectId}/tasks`, data),
  update:        (id, data)          => api.patch(`/tasks/${id}`, data),
  delete:        (id)                => api.delete(`/tasks/${id}`),
};

export const usersApi = {
  list:       ()         => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete:     (id)       => api.delete(`/users/${id}`),
};

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

export default api;
