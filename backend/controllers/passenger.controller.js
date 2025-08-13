const Booking = require('../models/Booking');
const Payment = require('../models/Payment') || null;
const calculateFare = require('../utils/fareCalculator');
const { tryAssignDriver } = require('../sockets/booking.socket');
const { BOOKING_STATUS } = require('../utils/constants');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const {
      pickup,
      drop,
      vehicleType = 'standard',
      preferredVehicleModel,
      preferredVehicleId
    } = req.body;

    // Validate coordinates
    if (!pickup?.coordinates || pickup.coordinates.length < 2) {
      return res.status(400).json({ message: 'Pickup coordinates are required [lng, lat]' });
    }
    if (!drop?.coordinates || drop.coordinates.length < 2) {
      return res.status(400).json({ message: 'Drop coordinates are required [lng, lat]' });
    }

    // Check for active booking
    const active = await Booking.findOne({
      passenger: req.user.id,
      status: { $in: ['pending', 'assigned', 'accepted', 'on_trip'] }
    });
    if (active) {
      return res.status(400).json({ message: 'Active booking exists', bookingId: active._id });
    }

    // Get vehicle pricing if provided
    let vehiclePricing = null;
    if (preferredVehicleId) {
      vehiclePricing = await Vehicle.findById(preferredVehicleId);
    } else if (preferredVehicleModel) {
      vehiclePricing = await Vehicle.findOne({ model: preferredVehicleModel });
    }

    // Fare calculation
    const fareDetails = calculateFare(
      pickup.coordinates,
      drop.coordinates,
      vehiclePricing || { type: vehicleType }
    );

    // Create booking in GeoJSON format
    const booking = await Booking.create({
      passenger: req.user.id,
      pickup: {
        address: pickup.address,
        location: {
          type: 'Point',
          coordinates: pickup.coordinates
        }
      },
      drop: {
        address: drop.address,
        location: {
          type: 'Point',
          coordinates: drop.coordinates
        }
      },
      vehicleType,
      preferredVehicleModel,
      preferredVehicleId,
      fare: fareDetails.totalFare,
      fareDetails
    });

    // Optional: create payment record
    if (Payment) {
      await Payment.create({
        booking: booking._id,
        amount: fareDetails.totalFare,
        status: 'pending'
      });
    }

    // Assign driver
    try {
      await tryAssignDriver(booking._id);
    } catch (assignErr) {
      console.error('Driver assignment failed:', assignErr.message);
    }

    return res.status(201).json({ message: 'Booking created', booking });

  } catch (err) {
    console.error('createBooking error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    'driver passenger preferredVehicleId'
  );
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (
    booking.passenger._id.toString() !== req.user.id &&
    req.user.role !== 'superadmin'
  )
    return res.status(403).json({ message: 'Unauthorized' });
  res.json({ booking });
};

// --- helpers ---
function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function findNearestDriver(UserModel, pickupCoords, vehicleType) {
  // pickupCoords = [lng, lat]
  const filter = {
    role: 'driver',
    available: true,
    'location.coordinates.0': { $exists: true }
  };
  if (vehicleType) filter['vehicle.type'] = vehicleType;

  const drivers = await UserModel.find(filter).populate('vehicle');
  if (!drivers || drivers.length === 0) return null;

  let best = null;
  let bestDist = Number.MAX_SAFE_INTEGER;
  drivers.forEach((d) => {
    try {
      const [dlng, dlat] =
        (d.location && d.location.coordinates) || [0, 0];
      const dist = haversineDistance(
        pickupCoords[1],
        pickupCoords[0],
        dlat,
        dlng
      );
      if (dist < bestDist) {
        bestDist = dist;
        best = { driver: d, dist };
      }
    } catch (e) {}
  });
  return best;
}

// --- createBookingWithMatch ---
exports.createBookingWithMatch = async (req, res) => {
  try {
    const passengerId =
      (req.user && req.user.id) || req.body.passenger || null;

    if (!passengerId) {
      return res.status(400).json({
        message: 'Passenger ID missing or you must be authenticated'
      });
    }

    const { pickup, drop, vehicleType, preferredVehicleId } = req.body;
    if (!pickup || !drop || !pickup.coordinates || !drop.coordinates) {
      return res.status(400).json({
        message:
          'pickup and drop coordinates required as { type, coordinates: [lng, lat] }'
      });
    }

    // Get vehicle pricing if preferredVehicleId given
    let vehiclePricing = null;
    if (preferredVehicleId) {
      vehiclePricing = await Vehicle.findById(preferredVehicleId);
    }

    const fareDetails = calculateFare(
      pickup.coordinates,
      drop.coordinates,
      vehiclePricing || { type: vehicleType }
    );

   const booking = new Booking({
  passenger: passengerId,
  pickup: {
    address: pickup.address,
    location: { type: 'Point', coordinates: pickup.coordinates }
  },
  drop: {
    address: drop.address,
    location: { type: 'Point', coordinates: drop.coordinates }
  },
  vehicleType,
  preferredVehicleId,
  fareDetails
});


    // Try to find nearest driver with vehicle filter
    const nearest = await findNearestDriver(User, pickup.coordinates, vehicleType);
    if (nearest) {
     booking.driver = nearest.driver._id; 
      booking.status = BOOKING_STATUS.ASSIGNED;
      booking.distanceKm = nearest.dist;
      // Reserve driver
      await User.findByIdAndUpdate(nearest.driver._id, { available: false });
    }

    await booking.save();
    return res.json({ booking, matched: !!nearest });
  } catch (err) {
    console.error('createBookingWithMatch error', err);
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const bookings = await Booking.find({
      $or: [{ passenger: userId }, { assignedDriver: userId }]
    }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: 'err' });
  }
};
