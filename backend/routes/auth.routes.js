const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');
const upload = require('../middlewares/upload');

// ✅ Register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validate,
  authController.register
);

// ✅ Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

// ✅ Logout
router.post('/logout', authController.logout);

// ✅ Forgot Password - Send OTP
router.post(
  '/forgot-password',
  upload.none(),
  [ body('phone').notEmpty().withMessage('Phone number is required') ],
  validate,
  authController.forgotPassword
);

// ✅ Verify OTP
router.post(
  '/verify-otp',
   upload.none(),
  [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  validate,
  authController.verifyOtp
);

// ✅ Reset Password
router.post(
  '/reset-password',
   upload.none(),
  [
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'), 
    body('confirmPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  authController.resetPassword
);
// Get all passengers
router.get('/passengers', authController.getAllPassengers);

// Get all drivers  
router.get('/drivers', authController.getAllDrivers);

router.get('/getAdminStats',authController.getAdminStats);




module.exports = router;
