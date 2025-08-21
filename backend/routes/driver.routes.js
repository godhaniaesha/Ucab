const router = require('express').Router();
const driverController = require('../controllers/driver.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { locationSchema } = require('../validators/schemas');
const { validate } = require('../middlewares/validation.middleware');
const upload = require('../middlewares/upload');

// Update location
router.post('/location', authMiddleware(['driver']), locationSchema, validate, driverController.updateLocation);

// Active booking
router.get('/checkNewRequests', authMiddleware(['driver']), driverController.checkNewRequests);
router.get('/active-booking', authMiddleware(['driver']), driverController.getActiveBooking);

// Set availability
router.post('/set-availability', authMiddleware(['driver']), driverController.setAvailability);

// Accept booking
router.post('/accept/:id', authMiddleware(['driver']), driverController.acceptBooking);
router.post('/cancle/:id', authMiddleware(['driver']), driverController.driverCancelBooking);
router.post('/start-trip/:id', authMiddleware(['driver']), driverController.startTrip);

// Complete booking
router.post('/complete/:id', authMiddleware(['driver']), driverController.completeBooking);

// Booking history
router.get('/history', authMiddleware(['driver']), driverController.getHistory);

router.post('/update-profile', authMiddleware(['driver','passenger','superadmin']),
upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "images", maxCount: 5 }
  ]),
driverController.updateProfile);

router.get('/getDriverStats',authMiddleware(['driver']),driverController.getDriverStats);


module.exports = router;
