// app.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // to serve videos locally

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/wallet', walletRoutes);

module.exports = app;
