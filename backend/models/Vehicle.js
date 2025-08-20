const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  make: String,
  model: String,
  year: Number,
  plate: String,
  type: { type: String, enum: ['standard','premium','luxury'], default: 'standard' },

  // New fields from image
  taxiDoors: { type: Number, default: 4 },
  passengers: { type: Number, default: 4 },
  luggageCarry: { type: Number, default: 2 },
  airCondition: { type: Boolean, default: true },
  gpsNavigation: { type: Boolean, default: true },

  // Pricing
  perKmRate: { type: Number, required: true },
  extraKmRate: { type: Number, required: true },

  // Multiple images (array of URLs)
  images: [{ type: String }], // store cloud/local URLs here

  // Vehicle description
  description: { type: String, default: '' } // optional description
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
