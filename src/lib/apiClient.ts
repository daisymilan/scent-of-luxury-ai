
/**
 * Frontend API Client
 * Responsible for making calls to our server API, which will then interact with WooCommerce
 */
import axios from 'axios';

// Create a centralized API client for frontend to backend communication
const apiClient = axios.create({
  baseURL: '/api', // Relative URL for same-origin requests to our backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(config => {
  console.log('API Request:', {
    url: config.url,
    method: config.method,
  });
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      console.error('API Request Error (No Response):', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
