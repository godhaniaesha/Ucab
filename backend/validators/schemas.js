const { body } = require('express-validator');
// validators/schemas.js
exports.bookingSchema = [
  body('pickup.address').notEmpty().withMessage('Pickup address is required'),
  body('pickup.type').equals('Point').withMessage('Pickup type must be Point'),
  body('pickup.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must have [lng, lat]'),
  
  body('drop.address').notEmpty().withMessage('Drop address is required'),
  body('drop.type').equals('Point').withMessage('Drop type must be Point'),
  body('drop.coordinates').isArray({ min: 2, max: 2 }).withMessage('Drop coordinates must have [lng, lat]'),

  body('vehicleType').optional().isIn(['standard','premium','luxury']),
  body('preferredVehicleModel').optional().isString(),
  body('preferredVehicleId').optional().isMongoId()
];

exports.locationSchema = [ body('coordinates').isArray({ min:2, max:2 }) ];
