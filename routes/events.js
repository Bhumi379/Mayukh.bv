const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// --- 1. GET ALL EVENTS ---
// Actual URL: http://localhost:5001/api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    console.log(`📤 Sending ${events.length} events to frontend`);
    res.json({ events }); 
  } catch (err) {
    console.error("❌ Error fetching events:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// --- 2. CREATE EVENT (With Images) ---
// Actual URL: http://localhost:5001/api/events
router.post('/', upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), async (req, res) => {
  try {
    let posterUrl = 'https://via.placeholder.com/400x200';
    let logoUrl = 'https://via.placeholder.com/50';

    // Handle Image Uploads
    if (req.files) {
        if (req.files['poster']) {
            const posterRes = await uploadToCloudinary(req.files['poster'][0].buffer, 'mayukh-events');
            posterUrl = posterRes.secure_url;
        }
        if (req.files['logo']) {
            const logoRes = await uploadToCloudinary(req.files['logo'][0].buffer, 'mayukh-events');
            logoUrl = logoRes.secure_url;
        }
    }

    const newEvent = new Event({
      ...req.body,
      posterLink: posterUrl,
      logoLink: logoUrl
    });

    await newEvent.save();
    console.log("✅ Event Saved:", newEvent.title);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("❌ Error saving event:", err);
    res.status(500).json({ message: err.message });
  }
});

// --- 3. DELETE EVENT ---
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;