const router = require('express').Router();
const driverController = require('../controllers/driver.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { locationSchema } = require('../validators/schemas');
const { validate } = require('../middlewares/validation.middleware');

// Update location
router.post('/location', authMiddleware(['driver']), locationSchema, validate, driverController.updateLocation);

// Active booking
router.get('/active-booking', authMiddleware(['driver']), driverController.getActiveBooking);

// Set availability
router.post('/set-availability', authMiddleware(['driver']), driverController.setAvailability);

// Accept booking
router.post('/accept/:id', authMiddleware(['driver']), driverController.acceptBooking);

// Complete booking
router.post('/complete/:id', authMiddleware(['driver']), driverController.completeBooking);

// Booking history
router.get('/history', authMiddleware(['driver']), driverController.getHistory);

router.post('/update-profile', authMiddleware(['driver']), driverController.updateProfile);


module.exports = router;
