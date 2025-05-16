
// lib/api.js
import axios from 'axios';

// Create a WooCommerce API client with proper authentication
const woo = axios.create({
  baseURL: import.meta.env.VITE_WOOCOMMERCE_API_URL || 'https://staging.min.com/int/wp-json/wc/v3',
  auth: {
    username: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || 'ck_83b6276178dfd425fb2618461bfb02aad3fd6d67',
    password: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || 'cs_a9ffe2c31156740acaa6dc82c50489717cb6d4d7',
  },
});

// Add request interceptor to debug authentication issues
woo.interceptors.request.use(config => {
  console.log('WooCommerce API Request:', {
    url: config.url,
    method: config.method,
    hasAuth: !!config.auth
  });
  return config;
});

// Add response interceptor to help debug errors
woo.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('WooCommerce API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config.url
      });
      
      // Specific handling for 401 errors
      if (error.response.status === 401) {
        console.error('WooCommerce Authentication Failed: Please check your API credentials');
      }
    } else if (error.request) {
      console.error('WooCommerce API Request Error:', error.request);
    } else {
      console.error('WooCommerce API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default woo;
