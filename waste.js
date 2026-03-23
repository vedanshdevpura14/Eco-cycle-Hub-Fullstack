// backend/routes/waste.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
// You'll need a middleware for handling file uploads, like 'multer'
// npm install multer
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// @route POST /api/waste/detect
router.post('/detect', upload.single('wasteImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image uploaded.');
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });

    // Call the Python AI service
    const aiServiceResponse = await axios.post('http://localhost:5001/predict', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    res.json(aiServiceResponse.data);

  } catch (error) {
    console.error('Error calling AI service:', error.message);
    res.status(500).send('Error processing image');
  }
});

module.exports = router;