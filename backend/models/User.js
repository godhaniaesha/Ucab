const mongoose = require('mongoose');
const { USER_ROLES, USER_STATUS } = require('../utils/constants');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.PASSENGER },
  phone: String,
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.OFFLINE },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  documentsVerified: { type: Boolean, default: false }
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });
module.exports = require('mongoose').model('User', UserSchema);
