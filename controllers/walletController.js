// controllers/walletController.js
const User = require('../models/User');

exports.rechargeWallet = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.id);
    user.walletBalance += Number(amount);
    await user.save();

    res.json({ message: 'Wallet recharged', walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: 'Recharge failed', error: err.message });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get balance', error: err.message });
  }
};
