const express = require('express');
const path = require('path');
const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'server/public')));

// Mock API routes for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login - accept any credentials for testing
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        email: email,
        username: 'Test User',
        role: 'user'
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Email and password required' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password, username } = req.body;
  
  // Mock signup
  res.json({
    success: true,
    user: {
      id: '1',
      email: email,
      username: username || 'New User',
      role: 'user'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock user check
  res.json({
    success: true,
    user: {
      id: '1',
      email: 'test@dttools.app',
      username: 'Test User',
      role: 'user'
    }
  });
});

// Mock other API routes
app.get('/api/*', (req, res) => {
  res.json({ success: true, message: 'Mock API response' });
});

app.post('/api/*', (req, res) => {
  res.json({ success: true, message: 'Mock API response' });
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DTTools Mock Server running on http://localhost:${PORT}`);
  console.log('📝 This is a simplified version for testing the frontend');
  console.log('🔑 You can login with any email/password combination');
});
