import axios from 'axios';
import { store } from '../app/store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api/v1', // Adjust this to your actual API endpoint
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get user from Redux store or localStorage
    const user = store.getState().auth.user || JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.id) {
      // Since there's no JWT token system, we can pass user ID in headers
      // or implement session-based authentication
      config.headers['X-User-ID'] = user.id.toString();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - could dispatch logout action
      console.warn('Unauthorized access - token may be expired');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
