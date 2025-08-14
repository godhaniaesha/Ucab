const User = require('../models/User');
const Booking = require('../models/Booking');
const { USER_STATUS, BOOKING_STATUS } = require('../utils/constants');
const Vehicle = require('../models/Vehicle');

exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) return res.status(400).json({ message: 'Invalid coordinates' });
    const driver = await User.findByIdAndUpdate(req.user.id, {
      location: { type: 'Point', coordinates },
      status: USER_STATUS.AVAILABLE,
      lastActiveAt: new Date()
    }, { new: true });
    res.json({ message: 'Updated', driver });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.startTrip = async (req, res) => {
  try {
    const driverId = req.user.id;
    const bookingId = req.params.id;
    const { coordinates } = req.body; // [lng, lat] from driver

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates format' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Must be assigned to this driver
    if (booking.assignedDriver.toString() !== driverId) {
      return res.status(403).json({ message: 'Not assigned to this driver' });
    }

    // Must be in "accepted" status before starting trip
    if (booking.status !== BOOKING_STATUS.ACCEPTED) {
      return res.status(400).json({ 
        message: 'Trip can only be started after the booking is accepted' 
      });
    }

    // Booking pickup coordinates
    const [pickupLng, pickupLat] = booking.pickup.location.coordinates;
    const [driverLng, driverLat] = coordinates;

    // Calculate distance in km
    const distanceKm = haversineDistance(driverLat, driverLng, pickupLat, pickupLng);

    // Allow start only if within 200 meters
    if (distanceKm <= 0.2) {
      booking.status = BOOKING_STATUS.IN_PROGRESS; // 'on_trip'
      booking.tripStartTime = new Date();
      await booking.save();

      res.json({ message: 'Trip started', booking });
    } else {
      res.status(400).json({
        message: 'Driver is too far from pickup location to start trip',
        distanceKm
      });
    }

  } catch (err) {
    console.error('startTrip error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getActiveBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      assignedDriver: req.user.id, // use correct field
      status: BOOKING_STATUS.IN_PROGRESS // 'on_trip'
    });
    res.json({ booking });
  } catch (err) {
    console.error('getActiveBooking error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.setAvailability = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { available, location } = req.body;
    const update = {
      status: available ? USER_STATUS.AVAILABLE : USER_STATUS.OFFLINE,
      available: !!available
    };
    if (location && location.coordinates) update.location = location;

    // Add debug logging
    console.log('Updating driver availability:', { userId, update });

    const updatedDriver = await User.findByIdAndUpdate(userId, update, { new: true });
    return res.json({ message: 'Availability updated', driver: updatedDriver });
  } catch (err) {
    console.error('Error updating availability:', err);
    return res.status(500).json({ message: 'err', error: err.message });
  }
}
exports.checkNewRequests = async (req, res) => {
  try {
    const driverId = req.user.id;

    // Include no_drivers if you want to see them
    const statusesToCheck = [
      BOOKING_STATUS.PENDING,
      BOOKING_STATUS.ASSIGNED,
      BOOKING_STATUS.NO_DRIVERS // optional
    ];

    const bookings = await Booking.find({
      assignedDriver: driverId,
      status: { $in: statusesToCheck }
    }).sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (err) {
    console.error('Error checking new requests:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const driverId = req.user && req.user.id;

    // Check driver bank info
    const driver = await User.findById(driverId).lean();
    if (!driver.bankDetails) {
      return res.status(400).json({
        message: 'Please complete your bank details before accepting bookings'
      });
    }

    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.assignedDriver && booking.assignedDriver.toString() !== driverId) {
      return res.status(403).json({ message: 'Not assigned to this driver' });
    }

    booking.status = 'accepted';
    await booking.save();

    return res.json({ message: 'Booking accepted', booking });
  } catch (err) {
    console.error('acceptBooking error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const haversineDistance = (lat1, lon1, lat2, lon2) => {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in km
};
exports.completeBooking = async (req, res) => {
  try {
    const driverId = req.user && req.user.id;
    const bookingId = req.params.id;
    const { coordinates } = req.body; // [lng, lat] from driver

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Ensure booking belongs to this driver
    if (booking.assignedDriver && booking.assignedDriver.toString() !== driverId) {
      return res.status(403).json({ message: 'Not assigned to this driver' });
    }

    // Ensure booking is in ON_TRIP status before completing
    if (booking.status !== BOOKING_STATUS.IN_PROGRESS) { // 'on_trip'
      return res.status(400).json({ message: 'Trip not started or already completed' });
    }

    // Drop-off coordinates from booking
    const [dropLng, dropLat] = booking.drop.location.coordinates;
    const [driverLng, driverLat] = coordinates;

    // Calculate distance in km
    const distanceKm = haversineDistance(driverLat, driverLng, dropLat, dropLng);

    // Allow completion only if within 200 meters (0.2 km)
    if (distanceKm <= 0.2) {
      booking.status = BOOKING_STATUS.PENDING_COMPLETION;
      booking.completedAt = new Date();
      await booking.save();

      // Mark driver available again
      await User.findByIdAndUpdate(driverId, { available: true });

      return res.json({ message: 'Booking completed successfully', booking });
    } else {
      return res.status(400).json({
        message: 'Driver is too far from drop-off location to complete booking',
        distanceKm
      });
    }
  } catch (err) {
    console.error('completeBooking error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getHistory = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const bookings = await Booking.find({ $or: [{ passenger: userId }, { assignedDriver: userId }] }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) { return res.status(500).json({ message: 'err', error: err.message }); }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, vehicle, bankDetails, paymentMethods } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Bank details (for payouts)
    if (bankDetails) {
      updateData.bankDetails = {
        accountHolderName: bankDetails.accountHolderName || '',
        accountNumber: bankDetails.accountNumber || '',
        ifscCode: bankDetails.ifscCode || '',
        bankName: bankDetails.bankName || '',
        branchName: bankDetails.branchName || ''
      };
    }

    // Payment methods (cards/wallets)
    if (Array.isArray(paymentMethods)) {
      // Optionally sanitize last4 if cardNumber provided
      updateData.paymentMethods = paymentMethods.map(method => ({
        ...method,
        last4: method.cardNumber
          ? method.cardNumber.slice(-4)
          : method.last4 || '',
        cardNumber: undefined // never store full card numbers
      }));
    }

    // Update user document
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    let updatedVehicle = null;

    // Driver-specific vehicle handling
    if (req.user.role === 'driver' && vehicle) {
      let driverVehicle = await Vehicle.findOne({ provider: userId });

      if (!driverVehicle) {
        updatedVehicle = await Vehicle.create({
          provider: userId,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          type: vehicle.type || 'standard',
          taxiDoors: vehicle.taxiDoors,
          passengers: vehicle.passengers,
          luggageCarry: vehicle.luggageCarry,
          airCondition: vehicle.airCondition,
          gpsNavigation: vehicle.gpsNavigation,
          perKmRate: vehicle.perKmRate,
          extraKmRate: vehicle.extraKmRate
        });
      } else {
        Object.keys(vehicle).forEach(key => {
          if (vehicle[key] !== undefined) {
            driverVehicle[key] = vehicle[key];
          }
        });
        updatedVehicle = await driverVehicle.save();
      }
    }

    res.json({
      message: 'Profile updated',
      user,
      vehicle: updatedVehicle
    });

  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

