const express = require('express');
const router = express.Router();
const {
  getPaymentDetails,
  processPayment,
  getPendingPayments
} = require('../controllers/payment.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Get pending payments for passenger
router.get('/pending',authMiddleware(['passenger']),  getPendingPayments);

// Get payment details for specific booking
router.get('/:bookingId',authMiddleware(['passenger']), getPaymentDetails);

// Process payment for booking
router.post('/:bookingId/pay',authMiddleware(['passenger']), processPayment);

module.exports = router;