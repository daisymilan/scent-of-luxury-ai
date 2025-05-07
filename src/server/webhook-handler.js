
// Express server to handle webhook requests from n8n voice authentication

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(bodyParser.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Authentication token required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes

// Webhook endpoint for receiving voice authentication results from n8n
app.post('/api/voice-auth-webhook', (req, res) => {
  try {
    const authData = req.body;
    
    // Check if authentication was successful in n8n
    if (!authData.authenticated) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed', 
        error: authData.error || 'Unknown error'
      });
    }
    
    // Validate required fields
    if (!authData.userId || !authData.token || !authData.command) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required authentication data'
      });
    }
    
    // Process the authenticated request
    // Here you would typically:
    // 1. Validate the token from n8n
    // 2. Create a session or JWT for your application
    
    // For this example, we'll create a new JWT with user info
    const sessionToken = jwt.sign({
      userId: authData.userId,
      userName: authData.userName || 'Unknown',
      userRole: authData.userRole || 'User',
      command: authData.command
    }, JWT_SECRET, { expiresIn: '1h' });
    
    // Return successful authentication with session token
    return res.status(200).json({
      success: true,
      message: 'Voice authentication successful',
      sessionToken,
      user: {
        id: authData.userId,
        name: authData.userName || 'Unknown',
        role: authData.userRole || 'User'
      },
      command: authData.command
    });
  } catch (error) {
    console.error('Error processing voice authentication webhook:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing authentication',
      error: error.message
    });
  }
});

// Protected endpoint example - requires authentication
app.get('/api/dashboard-data', authenticateToken, (req, res) => {
  // This endpoint would be called by your frontend after authentication
  // It represents a protected resource that requires the JWT token
  
  // Process the user's voice command that was stored in the JWT
  const command = req.user.command;
  
  // Example response - in a real application, you would process the command
  // and return relevant dashboard data
  res.json({
    success: true,
    user: req.user,
    dashboardData: {
      stats: {
        sales: 12500,
        orders: 150,
        customers: 45
      },
      recentOrders: [
        { id: 1, customer: 'Jane Doe', total: 230 },
        { id: 2, customer: 'John Smith', total: 180 }
      ]
    },
    processedCommand: command
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Voice authentication webhook handler running on port ${PORT}`);
});

module.exports = app; // For testing purposes
