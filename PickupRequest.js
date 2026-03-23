const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- Sub-schema for individual items within a pickup request ---
// This defines the structure for each item in the 'wasteItems' array.
const WasteItemSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
        required: true
    }
}, { _id: false }); // '_id: false' prevents Mongoose from creating a separate ID for each sub-item.


// --- Main Schema for the Pickup Request ---
const PickupRequestSchema = new Schema({
    // Link to the user who created the request (the customer).
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose to link to the 'User' collection.
        required: true
    },
    // Link to the user who accepts the request (the collector).
    collector: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This also links to the 'User' collection.
        default: null
    },
    // An array of waste items, using the schema defined above.
    wasteItems: [WasteItemSchema],
    
    // The calculated value of the waste.
    totalValue: {
        type: Number,
        required: true
    },
    // The address for the pickup.
    pickupAddress: {
        type: String,
        required: true,
        trim: true
    },
    // The current status of the pickup request.
    status: {
        type: String,
        required: true,
        // 'enum' ensures that the status can only be one of these four values.
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending'
    },
    // The date and time the pickup was marked as completed.
    completionTime: {
        type: Date
    }
}, {
    // This option automatically adds 'createdAt' and 'updatedAt' fields to the document.
    timestamps: true
});

module.exports = mongoose.model('PickupRequest', PickupRequestSchema);