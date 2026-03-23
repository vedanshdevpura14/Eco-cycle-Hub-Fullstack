// server.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors');

// 2. Create the Express app
const app = express();
const PORT = 3000; // Your backend will run on port 3000

// 3. Middleware
// This allows your frontend (on port 8080) to talk to your backend (on port 3000)
app.use(cors()); 
// This allows your server to accept JSON data in requests
app.use(express.json());

// 4. Create a simple API route for testing
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is connected and working!' });
});

// 5. Create the login route your frontend is trying to reach
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // For now, we'll just log the attempt and accept any login
    console.log('Login attempt received:', { username, password });

    if (username) {
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 6. Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running and listening on http://localhost:${PORT}`);
});