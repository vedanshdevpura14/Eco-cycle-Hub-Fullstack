// /models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be a hashed password
    userType: {
        type: String,
        enum: ['customer', 'collector'],
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    // Collector-specific fields
    vehicleDetails: {
        type: String // e.g., 'Truck - Medium Capacity'
    },
    serviceArea: {
        type: String // e.g., 'Jaipur Urban'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);