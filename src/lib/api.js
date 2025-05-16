
// lib/api.js
import axios from 'axios';

const woo = axios.create({
  baseURL: import.meta.env.VITE_WOOCOMMERCE_API_URL || 'https://staging.min.com/int/wp-json/wc/v3',
  auth: {
    username: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_KEY || 'ck_83b6276178dfd425fb2618461bfb02aad3fd6d67',
    password: import.meta.env.VITE_WOOCOMMERCE_CONSUMER_SECRET || 'cs_a9ffe2c31156740acaa6dc82c50489717cb6d4d7',
  },
});

export default woo;
