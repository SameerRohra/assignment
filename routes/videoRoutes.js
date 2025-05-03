// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  uploadVideo,
  getAllVideos,
  purchaseVideo,
  getVideoById,
} = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ensure uploads folder exists
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath); // Use the correct path
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getAllVideos);
router.get('/:id', authMiddleware, getVideoById);
router.post('/upload', authMiddleware, upload.single('video'), uploadVideo);  // Ensure 'video' key
router.post('/purchase/:id', authMiddleware, purchaseVideo);

module.exports = router;
