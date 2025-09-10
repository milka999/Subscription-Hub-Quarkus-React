import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Subscription Service
export const subscriptionService = {
  getSubscriptions: async (status = null) => {
    const params = status ? { status } : {};
    return apiClient.get('/subscriptions', { params });
  },

  getSubscription: async (id) => {
    return apiClient.get(`/subscriptions/${id}`);
  },

  createSubscription: async (data) => {
    return apiClient.post('/subscriptions', data);
  },

  updateStatus: async (id, status) => {
    return apiClient.patch(`/subscriptions/${id}`, null, {
      params: { status }
    });
  },

  deleteSubscription: async (id) => {
    return apiClient.delete(`/subscriptions/${id}`);
  }
};

// Statistics Service
export const statisticsService = {
  getUserStatistics: async () => {
    return apiClient.get('/subscriptions/stats');
  }
};

// Provider Service
export const providerService = {
  getServiceProviders: async (name = '', page = 0, rows = 10) => {
    return apiClient.get('/providers/services', {
      params: { name, page, rows }
    });
  },

  getProviderSubscriptions: async (serviceId) => {
    return apiClient.get(`/providers/subscriptions/${serviceId}`);
  }
};

// User Service
export const userService = {
  getCurrentUser: async () => {
    return apiClient.get('/users');
  },

  updateMonthlyLimit: async (limit) => {
    return apiClient.patch('/users', { monthlyLimit: limit });
  }
};

export default apiClient;