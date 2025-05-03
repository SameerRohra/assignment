// controllers/videoController.js
const Video = require('../models/Video');
const User = require('../models/User');

exports.uploadVideo = async (req, res) => {
  try {
    // Log the uploaded file to verify it's correctly processed
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, price, description } = req.body;
    const videoUrl = req.file.path;  // The path of the uploaded video

    // Create video entry in database
    const video = await Video.create({
      title,
      description,
      price,
      videoUrl,
      uploadedBy: req.user.id,  // Get user from the decoded JWT
    });

    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (err) {
    console.error('Error during video upload:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Fetching videos failed', error: err.message });
  }
};

exports.purchaseVideo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (user.purchasedVideos.includes(video._id))
      return res.status(400).json({ message: 'Already purchased' });

    if (user.walletBalance < video.price)
      return res.status(400).json({ message: 'Insufficient balance' });

    user.walletBalance -= video.price;
    user.purchasedVideos.push(video._id);
    await user.save();

    res.json({ message: 'Video purchased successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const user = await User.findById(req.user.id);

    const isPurchased = user.purchasedVideos.includes(video._id);

    if (!isPurchased) return res.status(403).json({ message: 'You must purchase this video' });

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch video', error: err.message });
  }
};
