// routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const {
  rechargeWallet,
  getWalletBalance,
} = require('../controllers/walletController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/recharge', authMiddleware, rechargeWallet);
router.get('/balance', authMiddleware, getWalletBalance);

module.exports = router;
