const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Store OTP temporarily (in production use DB or Redis)
const otpStore = {};

exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      phone, 
      vehicle, 
      bankDetails, 
      paymentMethods // array of { provider, customerId, paymentMethodId, methodType, last4 }
    } = req.body;

    // Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || 'passenger',
      phone,
      bankDetails: bankDetails || undefined,
      paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : []
    });

    // If driver, create vehicle
    if (role === 'driver' && vehicle) {
      const newVehicle = await Vehicle.create({
        provider: user._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        type: vehicle.type || 'standard',
        taxiDoors: vehicle.taxiDoors,
        passengers: vehicle.passengers,
        luggageCarry: vehicle.luggageCarry,
        airCondition: vehicle.airCondition,
        gpsNavigation: vehicle.gpsNavigation,
        perKmRate: vehicle.perKmRate,
        extraKmRate: vehicle.extraKmRate,
        description : vehicle.description || '', // optional description
      });

      user.vehicle = newVehicle._id;
      await user.save();
    }

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle || null,
        bankDetails: user.bankDetails || null,
        paymentMethods: user.paymentMethods || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        role: user.role, 
        vehicle: user.vehicle || null,
        bankDetails: user.bankDetails || null,
        paymentMethods: user.paymentMethods || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User with this phone not found' });

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP and expiry in user document
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for password reset is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error("Twilio error full object:", err);
    if (err.status && err.code) {
      return res.status(err.status).json({
        success: false,
        message: err.message,
        code: err.code,
        moreInfo: err.moreInfo,
        details: err.details || null
      });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


/**
 * 2️⃣ Verify OTP
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !user.otp) return res.status(400).json({ message: 'OTP not found. Please request again.' });
    if (Date.now() > user.otpExpires) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Please request again.' });
    }
    if (parseInt(otp) !== user.otp) return res.status(400).json({ message: 'Invalid OTP' });

    
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


/**
 * 3️⃣ Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword, confirmPassword } = req.body;

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    const user = await User.findOne({ phone });
    if (!user || !user.otp) {
      return res.status(400).json({ message: 'OTP not found. Please request again.' });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpires) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Please request again.' });
    }

    // Check if OTP is correct
    if (parseInt(otp) !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token,'token');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.id)
      .select('-password -otp -otpExpires')
      .populate('vehicle');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vehicle: user.vehicle || null,
        bankDetails: user.bankDetails || null,
        paymentMethods: user.paymentMethods || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
        address: user.address,
        profileImage: user.profileImage,
        preferences: user.preferences,
        ratings: user.ratings,
        tripHistory: user.tripHistory,
        notifications: user.notifications,
        documents: user.documents,
        verificationStatus: user.verificationStatus
      }
    });

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

