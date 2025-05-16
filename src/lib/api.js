// lib/api.js
import axios from 'axios';

const woo = axios.create({
  baseURL: process.env.WOOCOMMERCE_API_URL,
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
});

export default woo;
