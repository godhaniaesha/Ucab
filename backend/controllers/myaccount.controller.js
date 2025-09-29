// Get user account details (GET)
exports.getAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        location: user.location,
        vehicle: user.vehicle,
        documentsVerified: user.documentsVerified,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create new user (POST)
exports.createAccount = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      status,
      location,
      vehicle,
      documentsVerified,
      profileImage
    } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      phone,
      status,
      location,
      vehicle,
      documentsVerified,
      profileImage
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        location: user.location,
        vehicle: user.vehicle,
        documentsVerified: user.documentsVerified,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user (PUT)
exports.updateAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    let {
      name,
      email,
      password,
      role,
      phone,
      status,
      location,
      vehicle,
      documentsVerified,
      profileImage
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 12);
    if (role) updateData.role = role;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (vehicle) updateData.vehicle = vehicle;
    if (documentsVerified !== undefined) updateData.documentsVerified = documentsVerified;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        location: user.location,
        vehicle: user.vehicle,
        documentsVerified: user.documentsVerified,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
