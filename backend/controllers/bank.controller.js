// Get bankDetails and paymentMethods (GET)
exports.getBankPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bankDetails: user.bankDetails, paymentMethods: user.paymentMethods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const User = require('../models/User');

// Add bankDetails and paymentMethods (POST)
exports.addBankPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    let { bankDetails, paymentMethods } = req.body;

    // Parse if sent as string
    if (typeof bankDetails === 'string') {
      try { bankDetails = JSON.parse(bankDetails); } catch {}
    }
    if (typeof paymentMethods === 'string') {
      try { paymentMethods = JSON.parse(paymentMethods); } catch {}
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { bankDetails, paymentMethods },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bankDetails: user.bankDetails, paymentMethods: user.paymentMethods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit bankDetails and paymentMethods (PUT)
exports.editBankPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    let { bankDetails, paymentMethodUpdate } = req.body;

    // Find user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Merge bankDetails fields
    if (bankDetails && typeof bankDetails === 'object') {
      user.bankDetails = { ...user.bankDetails.toObject(), ...bankDetails };
    }

    // Update a specific payment method by paymentMethodId
    if (paymentMethodUpdate && paymentMethodUpdate.paymentMethodId) {
      user.paymentMethods = user.paymentMethods.map(pm => {
        if (pm.paymentMethodId === paymentMethodUpdate.paymentMethodId) {
          return { ...pm.toObject(), ...paymentMethodUpdate };
        }
        return pm;
      });
    }

    await user.save();
    res.json({ bankDetails: user.bankDetails, paymentMethods: user.paymentMethods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
