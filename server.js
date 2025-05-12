const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// WooCommerce Axios instance
const woo = axios.create({
  baseURL: process.env.WOOCOMMERCE_API_URL,
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
});

// --- All Orders ---
app.get('/api/orders', async (req, res) => {
  try {
    const { data } = await woo.get('/orders');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Single Order ---
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/orders/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- All Products ---
app.get('/api/products', async (req, res) => {
  try {
    const { data } = await woo.get('/products');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Single Product ---
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Product Variations (All for a Product) ---
app.get('/api/products/:id/variations', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}/variations`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Single Product Variation ---
app.get('/api/products/:productId/variations/:variationId', async (req, res) => {
  try {
    const { productId, variationId } = req.params;
    const { data } = await woo.get(`/products/${productId}/variations/${variationId}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- All Customers ---
app.get('/api/customers', async (req, res) => {
  try {
    const { data } = await woo.get('/customers');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Single Customer ---
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/customers/${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ WooCommerce API running at http://localhost:${PORT}`);
});
