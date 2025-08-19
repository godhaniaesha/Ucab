const router = require('express').Router();
const passengerController = require('../controllers/passenger.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { bookingSchema } = require('../validators/schemas');
const { validate } = require('../middlewares/validation.middleware');

router.post('/booking', authMiddleware(['passenger','superadmin','driver']), bookingSchema, validate, passengerController.createBooking);
router.get('/booking/:id', authMiddleware(['passenger','superadmin','driver']), passengerController.getBooking);
router.put('/booking/:id', authMiddleware(['passenger','superadmin','driver']), passengerController.cancelBooking);

router.get('/bookings',authMiddleware(['passenger','superadmin','driver']), passengerController.getHistory);

module.exports = router;
