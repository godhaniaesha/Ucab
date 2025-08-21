const Booking = require("../models/Booking");
const Payment = require("../models/Payment") || null;
const calculateFare = require("../utils/fareCalculator");
const {
  tryAssignDriver,
  driverSockets,
  assignDriverToBookingSync,
  passengerSockets,
} = require("../sockets/booking.socket");
const { BOOKING_STATUS, USER_STATUS } = require("../utils/constants");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const logger = require("../utils/logger");

exports.createBooking = async (req, res) => {
  try {
    const {
      pickup,
      drop,
      vehicleType = "standard", 
      preferredVehicleModel,
      preferredVehicleId,
    } = req.body;

    // Fetch passenger
    const passenger = await User.findById(req.user.id).lean();
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    // Validate payment info
    if (
      !passenger.bankDetails ||
      !passenger.paymentMethods ||
      passenger.paymentMethods.length === 0
    ) {
      return res.status(400).json({
        message:
          "Please complete your bank and payment details before creating a booking",
      });
    }

    // Validate coordinates
    if (!pickup?.coordinates || pickup.coordinates.length < 2) {
      return res
        .status(400)
        .json({ message: "Pickup coordinates are required [lng, lat]" });
    }
    if (!drop?.coordinates || drop.coordinates.length < 2) {
      return res
        .status(400)
        .json({ message: "Drop coordinates are required [lng, lat]" });
    }

    // Check for active booking
    const activeBooking = await Booking.findOne({
      passenger: req.user.id,
      status: { $in: ["pending", "assigned", "accepted", "on_trip"] },
    });
    if (activeBooking) {
      return res.status(400).json({
        message: "Active booking exists",
        bookingId: activeBooking._id,
      });
    }

    // Check for pending payment (block booking if any transaction is pending_completion)
    const pendingPaymentBooking = await Booking.findOne({
      passenger: req.user.id,
      status: BOOKING_STATUS.PENDING_COMPLETION,
    });
    if (pendingPaymentBooking) {
      return res.status(403).json({
        message:
          "You have a pending payment. Please complete your previous transaction before creating a new booking.",
        bookingId: pendingPaymentBooking._id,
      });
    }

    // Find vehicle pricing
    let vehiclePricing = null;
    if (preferredVehicleId) {
      vehiclePricing = await Vehicle.findOne({
        _id: preferredVehicleId,
        type: vehicleType,
      });
    } else if (preferredVehicleModel) {
      vehiclePricing = await Vehicle.findOne({
        type: vehicleType,
        $or: [
          { model: { $regex: preferredVehicleModel, $options: "i" } },
          { make: { $regex: preferredVehicleModel, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$make", " ", "$model"] },
                regex: preferredVehicleModel,
                options: "i",
              },
            },
          },
        ],
      });
    }

    if (!vehiclePricing) {
      return res
        .status(400)
        .json({ message: "No vehicle available for the selected type/model" });
    }

    // Calculate fare
    const fareDetails = calculateFare(
      pickup.coordinates,
      drop.coordinates,
      vehiclePricing
    );

    // Calculate distance using haversine formula
    const distanceKm = haversineDistance(
      pickup.coordinates[1],
      pickup.coordinates[0],
      drop.coordinates[1], 
      drop.coordinates[0]
    );

    // Create booking
    const booking = await Booking.create({
      passenger: req.user.id,
      pickup: {
        address: pickup.address,
        location: { type: "Point", coordinates: pickup.coordinates },
      },
      drop: {
        address: drop.address,
        location: { type: "Point", coordinates: drop.coordinates },
      },
      vehicleType,
      preferredVehicleModel,
      preferredVehicleId,
      fare: fareDetails.totalFare,
      fareDetails,
      distanceKm
    });

    // Create pending payment
    if (Payment) {
      await Payment.create({
        booking: booking._id,
        amount: fareDetails.totalFare,
        status: "pending",
      });
    }

    // Assign driver
    await assignDriverToBookingSync(booking._id);
    const updatedBooking = await Booking.findById(booking._id).lean();
    console.log(updatedBooking,'updatedBooking');
    

    if (updatedBooking.status === BOOKING_STATUS.NO_DRIVERS) {
      // Delete the booking if no driver found
      await Booking.findByIdAndDelete(booking._id);
      return res
        .status(400)
        .json({ message: "No cab available at your location" });
    }

    // ✅ Auto-reject after 10 minutes if driver hasn't accepted
    setTimeout(async () => {
      try {
        const freshBooking = await Booking.findById(booking._id);
        console.log(freshBooking,'freshBooking');
        
        if (freshBooking && freshBooking.status === BOOKING_STATUS.ASSIGNED) {
          freshBooking.status = BOOKING_STATUS.CANCELLED;
          await freshBooking.save();

          // Free driver so they can take other rides
          if (freshBooking.assignedDriver) {
            await User.findByIdAndUpdate(freshBooking.assignedDriver, {
              status: USER_STATUS.AVAILABLE,
            });
          }

          // Notify passenger
          const passengerSocket = passengerSockets.get(
            freshBooking.passenger.toString()
          );
          if (passengerSocket) {
            passengerSocket.emit("booking_auto_CANCELLED", {
              bookingId: freshBooking._id,
            });
          }

          // Notify driver (optional)
          const driverSocket = driverSockets.get(
            freshBooking.assignedDriver?.toString()
          );
          if (driverSocket) {
            driverSocket.emit("booking_expired", {
              bookingId: freshBooking._id,
            });
          }

          logger.info(
            `Booking ${freshBooking._id} auto-CANCELLED after 10 mins`
          );
        }
      } catch (err) {
        logger.error("Auto-reject check failed:", err);
      }
    }, 10 * 60 * 1000); // 10 minutes

    // ✅ Now the return stays at the very end
    return res.status(201).json({
      message:
        updatedBooking.status === BOOKING_STATUS.ASSIGNED
          ? "Booking created and driver assigned"
          : "Booking created",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    if (booking.passenger.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow cancellation for certain statuses
    const allowedStatuses = [BOOKING_STATUS.PENDING, BOOKING_STATUS.ASSIGNED];
    if (!allowedStatuses.includes(booking.status)) {
      return res.status(400).json({
        message: "Booking cannot be cancelled in current status",
      });
    }

    // Update booking status to cancelled
    booking.status = BOOKING_STATUS.CANCELLED;
    await booking.save();

    // Free up assigned driver if any
    if (booking.assignedDriver) {
      await User.findByIdAndUpdate(booking.assignedDriver, {
        status: USER_STATUS.AVAILABLE,
      });

      // Notify driver through socket

      const driverSocket = driverSockets.get(
        booking.assignedDriver?.toString()
      );
      if (driverSocket) {
        driverSocket.emit("booking_cancelled", { bookingId: booking._id });
        await User.findByIdAndUpdate(booking.assignedDriver, {
          status: USER_STATUS.AVAILABLE,
        });
      }
    }

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "driver passenger preferredVehicleId"
  );
  if (!booking) return res.status(404).json({ message: "Not found" });
  if (
    booking.passenger._id.toString() !== req.user.id &&
    req.user.role !== "superadmin"
  )
    return res.status(403).json({ message: "Unauthorized" });
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
    role: "driver",
    available: true,
    "location.coordinates.0": { $exists: true },
  };
  if (vehicleType) filter["vehicle.type"] = vehicleType;

  const drivers = await UserModel.find(filter).populate("vehicle");
  if (!drivers || drivers.length === 0) return null;

  let best = null;
  let bestDist = Number.MAX_SAFE_INTEGER;
  drivers.forEach((d) => {
    try {
      const [dlng, dlat] = (d.location && d.location.coordinates) || [0, 0];
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
    const passengerId = (req.user && req.user.id) || req.body.passenger || null;

    if (!passengerId) {
      return res.status(400).json({
        message: "Passenger ID missing or you must be authenticated",
      });
    }

    const { pickup, drop, vehicleType, preferredVehicleId } = req.body;
    if (!pickup || !drop || !pickup.coordinates || !drop.coordinates) {
      return res.status(400).json({
        message:
          "pickup and drop coordinates required as { type, coordinates: [lng, lat] }",
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
        location: { type: "Point", coordinates: pickup.coordinates },
      },
      drop: {
        address: drop.address,
        location: { type: "Point", coordinates: drop.coordinates },
      },
      vehicleType,
      preferredVehicleId,
      fareDetails,
    });

    // Try to find nearest driver with vehicle filter
    const nearest = await findNearestDriver(
      User,
      pickup.coordinates,
      vehicleType
    );
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
    console.error("createBookingWithMatch error", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const bookings = await Booking.find({
      $or: [{ passenger: userId }, { assignedDriver: userId }],
    }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ message: "err" });
  }
};
exports.getActiveRide = async (req, res) => {
  try {
    const userId = req.user.id;
    const activeRide = await Booking.findOne({
      passenger: userId,
      status: BOOKING_STATUS.IN_PROGRESS
    }).populate('assignedDriver');

    if(!activeRide) {
      return res.status(404).json({
        message: "No active ride found"
      });
    }

    return res.json({
      booking: activeRide
    });

  } catch(err) {
    console.error("getActiveRide error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
exports.getTodayStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get today's start and end dates
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all completed rides for today
    const todayRides = await Booking.find({
      passenger: userId,
      status: BOOKING_STATUS.COMPLETED,
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    // Get all completed rides (all time)
    const allCompletedRides = await Booking.find({
      passenger: userId,
      status: BOOKING_STATUS.COMPLETED
    });

    // Calculate stats
    const totalRides = todayRides.length;
    const totalSpent = allCompletedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    const totalCompletedRides = allCompletedRides.length;

    return res.json({
      todayStats: {
        totalRides,
        totalSpent,
        totalCompletedRides
      }
    });

  } catch(err) {
    console.error("getTodayStats error:", err);
    return res.status(500).json({
      message: "Server error", 
      error: err.message
    });
  }
};
