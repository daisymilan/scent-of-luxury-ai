const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// WooCommerce Axios instance - all API credentials kept on server
const woo = axios.create({
  baseURL: process.env.WOOCOMMERCE_API_URL,
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
});

// --- Status Check ---
app.get('/api/woocommerce/status', async (req, res) => {
  try {
    await woo.get('/products', { params: { per_page: 1 } });
    res.json({ status: 'Connected to WooCommerce API' });
  } catch (err) {
    console.error('WooCommerce API status check error:', err.message);
    res.status(500).json({ 
      error: 'Failed to connect to WooCommerce API',
      message: err.message
    });
  }
});

// --- Test Connection ---
app.get('/api/woocommerce/test-connection', async (req, res) => {
  try {
    const response = await woo.get('/products', { params: { per_page: 1 } });
    res.status(200).json({ success: true, message: 'Connection successful' });
  } catch (err) {
    console.error('WooCommerce connection test failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- All Orders ---
app.get('/api/woocommerce/orders', async (req, res) => {
  try {
    const { data, headers } = await woo.get('/orders', { params: req.query });
    
    // Extract pagination information
    const totalPages = parseInt(headers['x-wp-totalpages'] || '1', 10);
    
    res.json({
      orders: data,
      totalPages
    });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Order ---
app.get('/api/woocommerce/orders/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/orders/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching order ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Create Order ---
app.post('/api/woocommerce/orders', async (req, res) => {
  try {
    const { data } = await woo.post('/orders', req.body);
    res.json(data);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Update Order ---
app.put('/api/woocommerce/orders/:id', async (req, res) => {
  try {
    const { data } = await woo.put(`/orders/${req.params.id}`, req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error updating order ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- All Products ---
app.get('/api/woocommerce/products', async (req, res) => {
  try {
    const { data, headers } = await woo.get('/products', { params: req.query });
    
    // Extract pagination information
    const totalPages = parseInt(headers['x-wp-totalpages'] || '1', 10);
    
    res.json({
      products: data,
      totalPages
    });
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Product ---
app.get('/api/woocommerce/products/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching product ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Update Product ---
app.put('/api/woocommerce/products/:id', async (req, res) => {
  try {
    const { data } = await woo.put(`/products/${req.params.id}`, req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error updating product ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Product Variations ---
app.get('/api/woocommerce/products/:id/variations', async (req, res) => {
  try {
    const { data } = await woo.get(`/products/${req.params.id}/variations`, { params: req.query });
    res.json(data);
  } catch (err) {
    console.error(`Error fetching variations for product ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- All Customers ---
app.get('/api/woocommerce/customers', async (req, res) => {
  try {
    const { data, headers } = await woo.get('/customers', { params: req.query });
    
    // Extract pagination information
    const totalPages = parseInt(headers['x-wp-totalpages'] || '1', 10);
    
    res.json({
      customers: data,
      totalPages
    });
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Single Customer ---
app.get('/api/woocommerce/customers/:id', async (req, res) => {
  try {
    const { data } = await woo.get(`/customers/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching customer ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Create Customer ---
app.post('/api/woocommerce/customers', async (req, res) => {
  try {
    const { data } = await woo.post('/customers', req.body);
    res.json(data);
  } catch (err) {
    console.error('Error creating customer:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Update Customer ---
app.put('/api/woocommerce/customers/:id', async (req, res) => {
  try {
    const { data } = await woo.put(`/customers/${req.params.id}`, req.body);
    res.json(data);
  } catch (err) {
    console.error(`Error updating customer ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Delete Customer ---
app.delete('/api/woocommerce/customers/:id', async (req, res) => {
  try {
    await woo.delete(`/customers/${req.params.id}`, { params: { force: true } });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`Error deleting customer ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- B2BKing API Endpoints ---
app.get('/api/woocommerce/b2bking/:resource', async (req, res) => {
  try {
    const { resource } = req.params;
    const { type } = req.query;
    
    let endpoint = `/b2bking/${resource}`;
    if (resource === 'rules' && type) {
      endpoint += `?type=${type}`;
    }
    
    const { data } = await woo.get(endpoint);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching B2BKing ${req.params.resource}:`, err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: `B2BKing ${req.params.resource} not found or plugin not activated`,
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/woocommerce/b2bking/:resource/:id', async (req, res) => {
  try {
    const { resource, id } = req.params;
    const { data } = await woo.get(`/b2bking/${resource}/${id}`);
    res.json(data);
  } catch (err) {
    console.error(`Error fetching B2BKing ${req.params.resource} ${req.params.id}:`, err.message);
    
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ 
        error: `B2BKing ${req.params.resource} not found or plugin not activated`,
        message: err.message
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// --- WooCommerce Stats ---
app.get('/api/woocommerce/stats', async (req, res) => {
  try {
    const { dateRange } = req.query;
    
    // Get products and orders
    const [productsResponse, ordersResponse] = await Promise.all([
      woo.get('/products', { params: { per_page: 100 } }),
      woo.get('/orders', { params: { per_page: 100 } }),
    ]);
    
    const products = productsResponse.data;
    const orders = ordersResponse.data;
    
    // Get date range for filtering
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30); // Default to 30 days
    }
    
    // Filter orders by date range
    const filteredOrders = dateRange 
      ? orders.filter(order => new Date(order.date_created) >= startDate)
      : orders;
    
    // Calculate some basic stats
    const totalProducts = products.length;
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalVisitors = 500; // Mock data for conversion rate calculation
    
    // Calculate top selling products
    const productSales = {};
    
    filteredOrders.forEach(order => {
      order.line_items.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = {
            name: item.name,
            units: 0,
            revenue: 0,
          };
        }
        productSales[item.product_id].units += item.quantity;
        productSales[item.product_id].revenue += parseFloat(item.total);
      });
    });
    
    // Sort products by revenue
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id: parseInt(id),
        ...data
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    const statsData = {
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: totalOrders ? (totalRevenue / totalOrders).toFixed(2) : '0',
      totalVisitors, // Add this for conversion rate calculation
      topProducts,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      }
    };
    
    res.json(statsData);
  } catch (err) {
    console.error('Error calculating WooCommerce stats:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// For SPA routing - all remaining requests go to index.html
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Backend API running at http://localhost:${PORT}`);
});
