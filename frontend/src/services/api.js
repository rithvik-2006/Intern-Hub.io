// // src/services/api.js
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     if (user.id) {
//       config.headers['X-User-ID'] = user.id;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // User APIs
// export const userAPI = {
//   signup: (data) => apiClient.post('/users/signup', data),
//   login: (data) => apiClient.post('/users/login', data),
//   getAll: () => apiClient.get('/users'),
//   getById: (id) => apiClient.get(`/users/${id}`),
//   update: (id, data) => apiClient.put(`/users/${id}`, data),
//   delete: (id) => apiClient.delete(`/users/${id}`),
// };

// // Student Profile APIs
// export const studentAPI = {
//   create: (data) => apiClient.post('/students', data),
//   getAll: (params) => apiClient.get('/students', { params }),
//   getById: (id) => apiClient.get(`/students/${id}`),
//   getByUserId: (userId) => apiClient.get(`/students/user/${userId}`),
//   update: (id, data) => apiClient.patch(`/students/${id}`, data),
//   delete: (id) => apiClient.delete(`/students/${id}`),
// };

// // Startup APIs
// export const startupAPI = {
//   create: (data) => apiClient.post('/startups', data),
//   getAll: (params) => apiClient.get('/startups', { params }),
//   getById: (id) => apiClient.get(`/startups/${id}`),
//   getByUserId: (userId) => apiClient.get(`/startups/user/${userId}`),
//   update: (id, data) => apiClient.patch(`/startups/${id}`, data),
//   delete: (id) => apiClient.delete(`/startups/${id}`),
// };

// // Internship APIs
// export const internshipAPI = {
//   create: (data) => apiClient.post('/internships', data),
//   getAll: (params) => apiClient.get('/internships', { params }),
//   getById: (id) => apiClient.get(`/internships/${id}`),
//   getByStartupId: (startupId) => apiClient.get(`/internships/startup/${startupId}`),
//   update: (id, data) => apiClient.patch(`/internships/${id}`, data),
//   delete: (id) => apiClient.delete(`/internships/${id}`),
// };

// // Application APIs
// export const applicationAPI = {
//   create: (data) => apiClient.post('/applications', data),
//   getAll: () => apiClient.get('/applications'),
//   getById: (id) => apiClient.get(`/applications/${id}`),
//   getByStartupId: (startupId) => apiClient.get(`/applications/startup/${startupId}`),
//   getByStudentId: (studentId) => handleAPICall(() => apiClient.get(`/applications/student/${studentId}`)),
//   update: (id, data) => apiClient.patch(`/applications/${id}`, data),
//   delete: (id) => apiClient.delete(`/applications/${id}`),
// };

// export default apiClient;


// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      config.headers['X-User-ID'] = user.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  signup: (data) => apiClient.post('/users/signup', data),
  login: (data) => apiClient.post('/users/login', data),
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
};

// Student Profile APIs
export const studentAPI = {
  create: (data) => apiClient.post('/students', data),
  getAll: (params) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  getByUserId: (userId) => apiClient.get(`/students/user/${userId}`),
  update: (id, data) => apiClient.patch(`/students/${id}`, data),
  getMe: () => apiClient.get('/students/me'),
  delete: (id) => apiClient.delete(`/students/${id}`),
};

// Startup APIs
export const startupAPI = {
  create: (data) => apiClient.post('/startups', data),
  getAll: (params) => apiClient.get('/startups', { params }),
  getById: (id) => apiClient.get(`/startups/${id}`),
  getByUserId: (userId) => apiClient.get(`/startups/user/${userId}`),
  update: (id, data) => apiClient.patch(`/startups/${id}`, data),
  delete: (id) => apiClient.delete(`/startups/${id}`),
};

// Internship APIs
export const internshipAPI = {
  create: (data) => apiClient.post('/internships', data),
  getAll: (params) => apiClient.get('/internships', { params }),
  getById: (id) => apiClient.get(`/internships/${id}`),
  getByStartupId: (startupId) => apiClient.get(`/internships/startup/${startupId}`),
  update: (id, data) => apiClient.patch(`/internships/${id}`, data),
  delete: (id) => apiClient.delete(`/internships/${id}`),
};

// Application APIs
export const applicationAPI = {
  create: (data) => apiClient.post('/applications', data),
  getAll: () => apiClient.get('/applications'),
  getById: (id) => apiClient.get(`/applications/${id}`),
  getByStartupId: (startupId) => apiClient.get(`/applications/startup/${startupId}`),
  // ✅ FIXED: Removed handleAPICall wrapper
  getByStudentId: (studentId) => apiClient.get(`/applications/student/${studentId}`),
  update: (id, data) => apiClient.patch(`/applications/${id}`, data),
  delete: (id) => apiClient.delete(`/applications/${id}`),
};

export default apiClient;
