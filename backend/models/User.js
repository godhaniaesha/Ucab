const mongoose = require('mongoose');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');

const BankDetailsSchema = new mongoose.Schema({
  accountHolderName: String,
  accountNumber: String, // Encrypt before saving
  ifscCode: String,
  bankName: String,
  branchName: String
}, { _id: false });

const PaymentInfoSchema = new mongoose.Schema({
  provider: String, // 'razorpay', 'stripe'
  customerId: String,
  paymentMethodId: String, // Token from provider
  methodType: String, // 'card', 'bank'
  last4: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.PASSENGER },
  phone: String,
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.OFFLINE },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  documentsVerified: { type: Boolean, default: false },

  // Payouts (for drivers)
  bankDetails: BankDetailsSchema,

  // Online payment methods (for passengers)
  paymentMethods: [PaymentInfoSchema]

}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
