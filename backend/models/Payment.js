const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  status: { type: String, default: 'pending' },
  payoutTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For split payments
  payoutType: { type: String, enum: ['driver', 'owner'], default: 'driver' },
  transactionId: String,
  completedAt: Date
}, { timestamps: true });
module.exports = mongoose.model('Payment', PaymentSchema);
