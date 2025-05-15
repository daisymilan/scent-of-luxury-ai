
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
    const { data } = await woo.get('/orders', { params: req.query });
    res.json(data);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Order ---
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/orders/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching order ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- All Products ---
app.get('/api/products', async (req, res) => {
  try {
    const { data } = await woo.get('/products', { params: req.query });
    res.json(data);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Product ---
app.get('/api/products/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching product ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Product Variations (All for a Product) ---
app.get('/api/products/:id/variations', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}/variations`, { params: req.query });
    res.json(data);
  } catch (err) {
    console.error(`Error fetching variations for product ${req.params.id}:`, err.message);
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
    console.error(`Error fetching variation ${req.params.variationId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- All Customers ---
app.get('/api/customers', async (req, res) => {
  try {
    const { data } = await woo.get('/customers', { params: req.query });
    res.json(data);
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Customer ---
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/customers/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching customer ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- B2BKing endpoints ---

// --- All B2BKing Groups ---
app.get('/api/b2bking/groups', async (req, res) => {
  try {
    const { data } = await woo.get('/b2bking/groups', { params: req.query });
    res.json(data);
  } catch (err) {
    console.error('Error fetching B2BKing groups:', err.message);
    
    // Check if B2BKing plugin is not installed or not activated
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing plugin is not installed or not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- Single B2BKing Group ---
app.get('/api/b2bking/groups/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/b2bking/groups/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching B2BKing group ${req.params.id}:`, err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing group not found or B2BKing plugin is not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- All B2BKing Users ---
app.get('/api/b2bking/users', async (req, res) => {
  try {
    const { data } = await woo.get('/b2bking/users', { params: req.query });
    res.json(data);
  } catch (err) {
    console.error('Error fetching B2BKing users:', err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing plugin is not installed or not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- Single B2BKing User ---
app.get('/api/b2bking/users/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/b2bking/users/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching B2BKing user ${req.params.id}:`, err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing user not found or B2BKing plugin is not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- All B2BKing Rules ---
app.get('/api/b2bking/rules', async (req, res) => {
  try {
    const { type } = req.query;
    const endpoint = type ? `/b2bking/rules?type=${type}` : '/b2bking/rules';
    const { data } = await woo.get(endpoint);
    res.json(data);
  } catch (err) {
    console.error('Error fetching B2BKing rules:', err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing plugin is not installed or not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- B2BKing Rule by ID ---
app.get('/api/b2bking/rules/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/b2bking/rules/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching B2BKing rule ${req.params.id}:`, err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: 'B2BKing rule not found or B2BKing plugin is not properly activated',
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ WooCommerce API running at http://localhost:${PORT}`);
});
