const User = require('../models/User');
const Booking = require('../models/Booking');
const { USER_STATUS, BOOKING_STATUS } = require('../utils/constants');
const Vehicle = require('../models/Vehicle');

exports.updateLocation = async (req,res) => {
  try {
    const { coordinates } = req.body;
    if(!Array.isArray(coordinates) || coordinates.length!==2) return res.status(400).json({ message:'Invalid coordinates' });
    const driver = await User.findByIdAndUpdate(req.user.id, { location:{ type:'Point', coordinates }, status: USER_STATUS.AVAILABLE, lastActiveAt: new Date() }, { new: true });
    res.json({ message:'Updated', driver });
  } catch(err){ console.error(err); res.status(500).json({ message:'Server error' }); }
};

exports.getActiveBooking = async (req,res) => {
  const booking = await Booking.findOne({ driver: req.user.id, status: { $in: [BOOKING_STATUS.ASSIGNED, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS] }});
  res.json({ booking });
};


exports.setAvailability = async (req, res) => {
  try{
    const userId = req.user && req.user.id;
    const { available, location } = req.body;
    const update = { available: !!available };
    if(location && location.coordinates) update.location = location;
    await User.findByIdAndUpdate(userId, update);
    return res.json({ message: 'Availability updated', update });
  }catch(err){ return res.status(500).json({ message: 'err', error: err.message }); }
}

exports.acceptBooking = async (req, res) => {
  try{
    const driverId = req.user && req.user.id;
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if(!booking) return res.status(404).json({ message: 'Booking not found' });
    if(booking.assignedDriver && booking.assignedDriver.toString() !== driverId){
      return res.status(403).json({ message: 'Not assigned to this driver' });
    }
    booking.status = 'accepted';
    await booking.save();
    return res.json({ message: 'Booking accepted', booking });
  }catch(err){ return res.status(500).json({ message: 'err', error: err.message }); }
}

exports.completeBooking = async (req, res) => {
  try{
    const driverId = req.user && req.user.id;
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if(!booking) return res.status(404).json({ message: 'Booking not found' });
    if(booking.assignedDriver && booking.assignedDriver.toString() !== driverId){
      return res.status(403).json({ message: 'Not assigned to this driver' });
    }
    booking.status = 'completed';
    await booking.save();
    // mark driver available again
    await User.findByIdAndUpdate(driverId, { available: true });
    return res.json({ message: 'Booking completed', booking });
  }catch(err){ return res.status(500).json({ message: 'err', error: err.message }); }
}

exports.getHistory = async (req, res) => {
  try{
    const userId = req.user && req.user.id;
    const bookings = await Booking.find({ $or: [ { passenger: userId }, { assignedDriver: userId } ] }).sort({ createdAt: -1 });
    return res.json(bookings);
  }catch(err){ return res.status(500).json({ message: 'err', error: err.message }); }
}

exports.updateProfile = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { name, phone, vehicle } = req.body;

    // Prepare driver updates
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Update driver basic info
    const driver = await User.findByIdAndUpdate(driverId, updateData, { new: true });

    let updatedVehicle = null;

    // Update or create vehicle if driver provided vehicle details
    if (vehicle) {
      let driverVehicle = await Vehicle.findOne({ provider: driverId });

      if (!driverVehicle) {
        updatedVehicle = await Vehicle.create({
          provider: driverId,
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
        // Update only provided fields
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
      driver,
      vehicle: updatedVehicle
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

