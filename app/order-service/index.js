require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

// Protected orders endpoint
app.get('/orders', verifyToken, async (req, res) => {
  try {
    // Generate service token for internal call
    const serviceToken = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Call user-service internally
    const userResponse = await axios.get('http://user-service:3001/users', {
      headers: {
        'Authorization': `Bearer ${serviceToken}`
      }
    });

    const users = userResponse.data.users;

    // Sample orders data
    const orders = [
      { id: 1, userId: 1, product: 'Laptop', amount: 1200 },
      { id: 2, userId: 2, product: 'Phone', amount: 800 },
      { id: 3, userId: 1, product: 'Tablet', amount: 500 }
    ];

    // Combine orders with user data
    const ordersWithUsers = orders.map(order => {
      const user = users.find(u => u.id === order.userId);
      return { ...order, user };
    });

    res.json({ orders: ordersWithUsers });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});