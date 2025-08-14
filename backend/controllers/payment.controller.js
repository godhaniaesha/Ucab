const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { BOOKING_STATUS } = require('../utils/constants');

// Get payment details for a booking
const getPaymentDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const passengerId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate('assignedDriver', 'name')
      .populate('passenger', 'name');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.passenger._id.toString() !== passengerId) return res.status(403).json({ message: 'Unauthorized' });

    const payment = await Payment.findOne({ booking: bookingId });

    res.json({
      booking: {
        id: booking._id,
        fare: booking.fare,
        fareDetails: booking.fareDetails,
        pickup: booking.pickup,
        drop: booking.drop,
        driverName: booking.assignedDriver?.name,
        status: booking.status
      },
      payment: {
        id: payment?._id,
        amount: payment?.amount || booking.fare,
        status: payment?.status || 'pending'
      }
    });

  } catch (err) {
    console.error('getPaymentDetails error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Process payment using static/manual flow
const processPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const passengerId = req.user.id;
   
    
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.passenger.toString() !== passengerId) return res.status(403).json({ message: 'Unauthorized' });
    if (booking.status !== BOOKING_STATUS.PENDING_COMPLETION)
      return res.status(400).json({ message: 'Booking is not ready for payment' });

    let payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
      payment = await Payment.create({
        booking: bookingId,
        amount: booking.fare,
        status: 'pending'
      });
    }

    // Static payment: just mark as completed
    payment.status = 'completed';
    payment.transactionId = `STATIC_${Date.now()}`;
    payment.completedAt = new Date();
    await payment.save();

    booking.status = BOOKING_STATUS.COMPLETED;
    booking.completedAt = new Date();
    await booking.save();

    // Make driver available
    await User.findByIdAndUpdate(booking.assignedDriver, { available: true });

    res.json({
      message: 'Payment marked as completed (static)',
      payment,
      booking,
      transactionId: payment.transactionId
    });

  } catch (err) {
    console.error('processPayment error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get passenger's pending payments
const getPendingPayments = async (req, res) => {
  try {
    const passengerId = req.user.id;

    const pendingBookings = await Booking.find({
      passenger: passengerId,
      status: BOOKING_STATUS.PENDING_COMPLETION
    })
      .populate('assignedDriver', 'name')
      .sort({ tripEndTime: -1 });
    const paymentsWithDetails = await Promise.all(
      pendingBookings.map(async (booking) => {
        const payment = await Payment.findOne({ booking: booking._id });
        return {
          bookingId: booking._id,
          fare: booking.fare,
          fareDetails: booking.fareDetails,
          pickup: booking.pickup,
          drop: booking.drop,
          driverName: booking.assignedDriver?.name,
          tripEndTime: booking.tripEndTime,
          payment: {
            id: payment?._id,
            amount: payment?.amount || booking.fare,
            status: payment?.status || 'pending'
          }
        };
      })
    );

    res.json({ pendingPayments: paymentsWithDetails });

  } catch (err) {
    console.error('getPendingPayments error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getPaymentDetails,
  processPayment,
  getPendingPayments
};
