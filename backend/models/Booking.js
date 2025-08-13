const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  passenger: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  pickup: {
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    }
  },

  drop: {
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  },

  vehicleType: { type: String, enum: ['standard', 'premium', 'luxury'], default: 'standard' },
  preferredVehicleModel: { type: String },
  preferredVehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  status: { type: String, enum: ['pending','assigned','accepted','on_trip','completed','cancelled'], default: 'pending' },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  fare: { type: Number, default: 0 },
  distanceKm: { type: Number, default: 0 },
  fareDetails: { type: Object },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BookingSchema.index({ 'pickup.location': '2dsphere' });
BookingSchema.index({ 'drop.location': '2dsphere' });

BookingSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
