// /models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobileNumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5m' } // OTP expires in 5 minutes
});

module.exports = mongoose.model('Otp', otpSchema);