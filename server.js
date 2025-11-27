const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('build'));

// Cloudflare Turnstile verification endpoint
app.post('/api/verify-turnstile', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token is required' 
      });
    }

    // Verify token with Cloudflare
    const verificationResponse = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      `secret=${encodeURIComponent(process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const result = verificationResponse.data;

    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Verification successful' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Verification failed',
        errorCodes: result['error-codes'] || []
      });
    }
  } catch (error) {
    console.error('Turnstile verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
