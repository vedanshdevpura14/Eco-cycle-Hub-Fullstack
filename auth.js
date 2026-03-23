// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
// We will simulate OTP for now. You would integrate Twilio here.

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
    const { username, mobileNumber, password, userType } = req.body;

    try {
        let user = await User.findOne({ mobileNumber });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, mobileNumber, password, userType });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).send('User registered successfully');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body; // Assuming frontend sends this

    try {
        // Find user by username or mobile number
        let user = await User.findOne({
            $or: [{ username: emailOrUsername }, { mobileNumber: emailOrUsername }]
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Return jsonwebtoken
        const payload = {
            user: { id: user.id }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 }, // Expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ token, userType: user.userType });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;