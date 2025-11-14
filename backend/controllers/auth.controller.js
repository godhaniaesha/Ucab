
// const FacebookStrategy = require('passport-facebook').Strategy;

// Configure Google Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/api/auth/google/callback"
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ email: profile.emails[0].value });
//     if (!user) {
//       user = await User.create({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         password: '',
//         role: 'passenger',
//         profileImage: profile.photos[0]?.value || null
//       });
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// Configure Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: "/api/auth/facebook/callback",
//   profileFields: ['id', 'displayName', 'photos', 'email']
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ email: profile.emails[0].value });
//     if (!user) {
//       user = await User.create({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         password: '',
//         role: 'passenger',
//         profileImage: profile.photos[0]?.value || null
//       });
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// Serialize/Deserialize user
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });

// Google login API


// exports.googleCallback = (req, res) => {
//   // Successful login, send success, token, and user
//   const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//   res.json({
//     success: true,
//     token,
//     user: req.user
//   });
// };

// Facebook login API
// exports.facebookLogin = passport.authenticate('facebook', { scope: ['email'] });
// exports.facebookCallback = (req, res) => {
//   // Successful login, send JWT or redirect
//   const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//   res.json({ token, user: req.user });
// };
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { USER_ROLES } = require('../utils/constants');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

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
      paymentMethods
    } = req.body;

    // Check email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Format phone with +91
    const formattedPhone = `+91${phone}`;

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "passenger",
      phone: formattedPhone,
      bankDetails: bankDetails || null,
      paymentMethods: Array.isArray(paymentMethods) ? paymentMethods : []
    });

    

    // If driver → add vehicle
    if (role === "driver" && vehicle) {
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
        description: vehicle.description || "",
      });

      user.vehicle = newVehicle._id;
      await user.save();
    }

    // ✅ Generate token (same as login)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Final response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        vehicle: user.vehicle || null,
        bankDetails: user.bankDetails || null,
        paymentMethods: user.paymentMethods || []
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
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
      { expiresIn: '1d' }
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

exports.logout = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Add token to blacklist in memory (in production use Redis/DB)
    global.blacklistedTokens = global.blacklistedTokens || new Set();
    global.blacklistedTokens.add(token);

    // Since token is sent in response body during login, not as cookie,
    // we just need to send success response. Token invalidation is now
    // handled server-side by blacklisting the token.
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    var { phone } = req.body;
    console.log("Received phone number:", phone);


    console.log("Formatted phone number for Twilio:", phone);
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User with this phone not found' });

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP and expiry in user document
    user.otp = otp;
    console.log(otp, "otp");

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

// Verify OTP API
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    res.json({
      success: true,
      message: 'OTP verified successfully',
      phone: user.phone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reset Password API
exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword, confirmPassword } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear OTP data
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


/**
 * 2️⃣ Verify OTP
 */
exports.googleLogin = async (req, res) => {
  try {
    const { email, firstName, lastName, photo } = req.body;

    let checkUser = await User.findOne({ email });

    if (!checkUser) {
      checkUser = await User.create({ email, firstName, lastName, photo, role: "passenger" });
    }

    // If checkUser is an array (from find), get the first user object
    const userObj = Array.isArray(checkUser) ? checkUser[0] : checkUser;

    const token = jwt.sign(
      { id: userObj._id, role: userObj.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res
      .cookie("accessToken", token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "Strict" })
      .status(200)
      .json({
        success: true,
        user: checkUser,
        message: "User Login successfully",
        token
      });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
}
exports.getUser = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token, 'token');

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

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: USER_ROLES.DRIVER })
      .populate('vehicle')
      .select('-password -otp -otpExpires');

    res.json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all passengers
exports.getAllPassengers = async (req, res) => {
  try {
    const passengers = await User.find({ role: USER_ROLES.PASSENGER })
      .select('-password -otp -otpExpires');

    res.json({
      success: true,
      count: passengers.length,
      passengers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
/**
 * Admin Stats API
 * Returns: total drivers, total passengers, rides today, today's revenue, pending verification
 */
// Get all users API
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude sensitive information
    const users = await User.find()
      .select('-password -otp -otpExpires')
      .populate('vehicle');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Find Email API
exports.findEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        success: true,
        message: 'Email already exists',
        exists: true
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
        exists: false
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Total drivers
    const totalDrivers = await User.countDocuments({ role: USER_ROLES.DRIVER });
    // Total passengers
    const totalPassengers = await User.countDocuments({ role: USER_ROLES.PASSENGER });

    // Rides today (completed bookings)
    const ridesToday = await Booking.countDocuments({
      status: 'completed',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    // Today's revenue (sum of completed payments for today's bookings)
    const payments = await Payment.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'booking',
          foreignField: '_id',
          as: 'bookingInfo'
        }
      },
      { $unwind: '$bookingInfo' },
      {
        $match: {
          status: 'completed',
          'bookingInfo.createdAt': { $gte: todayStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    const todaysRevenue = payments.length > 0 ? Math.round(payments[0].total) : 0;
    // Pending verification (drivers with documentsVerified: false)
    const pendingVerification = await Booking.countDocuments({ status: 'assigned' });
    res.json({
      success: true,
      stats: {
        totalDrivers,
        totalPassengers,
        ridesToday,
        todaysRevenue,
        pendingVerification
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

