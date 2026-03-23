const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');

// @route   POST api/pickups
// @desc    Create a new pickup request (for Customers)
// @access  Private
router.post('/', auth, async (req, res) => {
    const { wasteItems, totalValue, pickupAddress } = req.body;

    // Basic validation
    if (!wasteItems || wasteItems.length === 0 || !totalValue || !pickupAddress) {
        return res.status(400).json({ msg: 'Please provide all required pickup details' });
    }

    try {
        const newPickup = new PickupRequest({
            customer: req.user.id, // Get user ID from the auth token
            wasteItems,
            totalValue,
            pickupAddress,
            status: 'pending' // Explicitly set status
        });

        const pickup = await newPickup.save();
        res.status(201).json(pickup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const pickup = await PickupRequest.findById(req.params.id)
            .populate('customer', ['username', 'mobileNumber']);

        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup not found' });
        }
        
        // Security check (optional but recommended): 
        // Ensure the person viewing is either the customer or the assigned collector
        const isCustomer = pickup.customer._id.toString() === req.user.id;
        const isCollector = pickup.collector && pickup.collector.toString() === req.user.id;

        if (!isCustomer && !isCollector) {
            return res.status(401).json({ msg: 'User not authorized to view this pickup' });
        }

        res.json(pickup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/pickups/collector/available
// @desc    Get all available (pending) pickups (for Collectors)
// @access  Private
router.get('/collector/available', auth, async (req, res) => {
    try {
        const availablePickups = await PickupRequest.find({ status: 'pending' })
            .populate('customer', ['username']) // Attach customer's username
            .sort({ createdAt: -1 }); // Show newest first

        res.json(availablePickups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/pickups/collector/active
// @desc    Get active pickups assigned to the logged-in collector
// @access  Private
router.get('/collector/active', auth, async (req, res) => {
    try {
        const activePickups = await PickupRequest.find({
            collector: req.user.id,
            status: 'accepted'
        })
        .populate('customer', ['username', 'mobileNumber']) // Include more customer details
        .sort({ createdAt: 1 }); // Show oldest accepted first

        res.json(activePickups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/pickups/accept/:id
// @desc    Allow a collector to accept a pickup request
// @access  Private
router.put('/accept/:id', auth, async (req, res) => {
    try {
        const pickup = await PickupRequest.findById(req.params.id);

        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup request not found' });
        }
        if (pickup.status !== 'pending') {
            return res.status(400).json({ msg: 'Pickup is no longer available' });
        }

        pickup.status = 'accepted';
        pickup.collector = req.user.id; // Assign the logged-in collector

        await pickup.save();
        res.json(pickup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/pickups/complete/:id
// @desc    Allow a collector to mark a pickup as complete
// @access  Private
router.put('/complete/:id', auth, async (req, res) => {
    try {
        const pickup = await PickupRequest.findById(req.params.id);

        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup request not found' });
        }
        // Security check: ensure the user completing the job is the assigned collector
        if (pickup.collector.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to complete this pickup' });
        }
        if (pickup.status !== 'accepted') {
            return res.status(400).json({ msg: 'Pickup must be in accepted state to be completed' });
        }

        pickup.status = 'completed';
        pickup.completionTime = Date.now();

        await pickup.save();
        res.json(pickup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/pickups/cancel/:id
// @desc    Allow a collector to cancel an accepted pickup
// @access  Private
router.put('/cancel/:id', auth, async (req, res) => {
    try {
        const pickup = await PickupRequest.findById(req.params.id);

        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup request not found' });
        }
        // Security check: ensure the user canceling the job is the assigned collector
        if (pickup.collector.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to cancel this pickup' });
        }
        if (pickup.status !== 'accepted') {
            return res.status(400).json({ msg: 'Cannot cancel a pickup that is not in an accepted state' });
        }

        pickup.status = 'cancelled';
        // You could also add a cancellation reason from req.body if you extend the schema
        // pickup.cancellationReason = req.body.reason;

        await pickup.save();
        res.json(pickup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/pickups/customer
// @desc    Get all pickups for the logged-in customer (for their history)
// @access  Private
router.get('/customer', auth, async (req, res) => {
    try {
        // Find all pickups where the 'customer' field matches the logged-in user's ID
        const customerPickups = await PickupRequest.find({ customer: req.user.id })
            .populate('collector', ['username']) // Optionally show the collector's name if assigned
            .sort({ createdAt: -1 }); // Show the most recent requests first

        res.json(customerPickups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/pickups/collector/history
// @desc    Get the logged-in collector's pickup history (completed or cancelled)
// @access  Private
router.get('/collector/history', auth, async (req, res) => {
    try {
        const pickupHistory = await PickupRequest.find({
            collector: req.user.id,
            status: { $in: ['completed', 'cancelled'] } // Find documents with status 'completed' OR 'cancelled'
        })
        .populate('customer', ['username']) // Attach the customer's name
        .sort({ updatedAt: -1 }); // Show the most recently updated jobs first

        res.json(pickupHistory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;