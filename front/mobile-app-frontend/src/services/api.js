import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's IP address instead of localhost for physical devices
// For emulator, you can use 10.0.2.2 for Android or localhost for iOS
const API_BASE_URL = 'http://10.0.2.2:8080'; // Change this to your machine's IP

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
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