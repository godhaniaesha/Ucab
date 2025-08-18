const router = require('express').Router();
const passengerController = require('../controllers/passenger.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { bookingSchema } = require('../validators/schemas');
const { validate } = require('../middlewares/validation.middleware');

router.post('/booking', authMiddleware(['passenger']), bookingSchema, validate, passengerController.createBooking);
router.get('/booking/:id', authMiddleware(['passenger','superadmin']), passengerController.getBooking);

router.get('/bookings',authMiddleware(['passenger']), passengerController.getHistory);

module.exports = router;
