const User = require("../models/User");
const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const { BOOKING_STATUS, USER_STATUS } = require("../utils/constants");
const logger = require("../utils/logger");

let ioInstance;
const driverSockets = new Map();
const passengerSockets = new Map();

async function findNearbyDrivers(
  coordinates,
  vehicleType = "standard",
  radiusMeters = 5000,
  preferredVehicleModel = null,
  preferredVehicleId = null
) {
  try {
    // First try drivers with matching preferred vehicle (if provided)
    const baseQuery = {
      role: "driver",
      status: USER_STATUS.AVAILABLE,
      // documentsVerified: true,  // Comment this line for testing
      location: {
        $near: {
          $geometry: { type: "Point", coordinates },
          $maxDistance: radiusMeters,
        },
      },
    };

    logger.debug("findNearbyDrivers base query", baseQuery);
    // Add vehicleType to base query if provided
    if (vehicleType && vehicleType !== "standard") {
      const vehicles = await Vehicle.find({ type: vehicleType });
      const vehicleIds = vehicles.map((v) => v._id);
      baseQuery.vehicle = { $in: vehicleIds };
    }

    // Add debug logging
    console.log("Finding drivers with query:", JSON.stringify(baseQuery));
    // If preferredVehicleId provided, prefer drivers with that vehicle
    if (preferredVehicleId) {
      const drivers = await User.find({
        ...baseQuery,
        vehicle: preferredVehicleId,
      })
        .populate("vehicle")
        .limit(20);
      if (drivers && drivers.length) return drivers;
    }

    // If preferredVehicleModel provided (string match against vehicle.make/model)
    if (preferredVehicleModel) {
      // find vehicles matching the model string, then match drivers
      const vehicles = await Vehicle.find({
        $or: [
          { model: { $regex: preferredVehicleModel, $options: "i" } },
          { make: { $regex: preferredVehicleModel, $options: "i" } },
        ],
      }).limit(50);
      if (vehicles && vehicles.length) {
        const vehicleIds = vehicles.map((v) => v._id);
        const drivers = await User.find({
          ...baseQuery,
          vehicle: { $in: vehicleIds },
        })
          .populate("vehicle")
          .limit(20);
        if (drivers && drivers.length) return drivers;
      }
    }

    // Fallback: find any nearby drivers matching vehicleType
    // Note: The original code does not filter by vehicleType here directly
    // If you want to strictly enforce vehicleType even on fallback, you'd need to add it here
    const drivers = await User.find({ ...baseQuery })
      .populate("vehicle")
      .limit(50);
    return drivers;
  } catch (err) {
    logger.error("findNearbyDrivers error", err);
    return [];
  }
}

async function assignDriverToBooking(bookingId) {
  try {
    const booking = await Booking.findById(bookingId).populate("passenger");
    if (!booking || booking.status !== BOOKING_STATUS.PENDING) return null;

    const pickupCoords = booking.pickup.location?.coordinates;
    const drivers = await findNearbyDrivers(
      pickupCoords,
      booking.vehicleType,
      5000,
      booking.preferredVehicleModel,
      booking.preferredVehicleId
    );
    if (!drivers.length) {
      booking.status = BOOKING_STATUS.NO_DRIVERS;
      await booking.save();
      return booking;
    }

    const driver = drivers[0];
    booking.status = BOOKING_STATUS.ASSIGNED;
    booking.assignedAt = new Date();
    booking.assignedDriver = driver._id;
    await booking.save();

    await User.findByIdAndUpdate(driver._id, { status: USER_STATUS.BUSY });

    // Emit to driver socket
    const driverSocket = driverSockets.get(driver._id.toString());
    if (driverSocket) {
      driverSocket.emit("ride_request", {
        bookingId: booking._id,
        pickup: booking.pickup,
        drop: booking.drop,
        fareDetails: booking.fareDetails,
      });
    }

    return booking; // <--- Return the updated booking
  } catch (err) {
    console.error("assignDriverToBooking error", err);
    return null;
  }
}

function waitForDriverResponse(bookingId, driverId, timeout = 30000) {
  return new Promise((resolve) => {
    const eventName = `driver_response_${bookingId}_${driverId}`;
    let resolved = false;
    const handler = (accepted) => {
      if (!resolved) {
        resolved = true;
        ioInstance.off(eventName, handler);
        resolve(accepted);
      }
    };
    ioInstance.once(eventName, handler);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        ioInstance.off(eventName, handler);
        resolve(false);
      }
    }, timeout);
  });
}

function initSockets(io) {
  ioInstance = io;
  io.on("connection", (socket) => {
    socket.on("register_driver", (data) => {
      if (data && data.driverId) {
        driverSockets.set(data.driverId, socket);
        socket.driverId = data.driverId;
      }
    });
    socket.on("register_passenger", (data) => {
      if (data && data.passengerId) {
        passengerSockets.set(data.passengerId, socket);
        socket.passengerId = data.passengerId;
      }
    });

    socket.on("accept_booking", async (data) => {
      try {
        const { bookingId, driverId } = data;
        const booking = await Booking.findById(bookingId);
        if (!booking || booking.status !== BOOKING_STATUS.ASSIGNED) {
          socket.emit("booking_error", { message: "Not available" });
          return;
        }
        booking.status = BOOKING_STATUS.ACCEPTED;
        booking.acceptedAt = new Date();
        await booking.save();
        const passengerSocket = passengerSockets.get(
          booking.passenger.toString()
        );
        if (passengerSocket)
          passengerSocket.emit("booking_accepted", {
            bookingId: booking._id,
            driver: await User.findById(driverId).populate("vehicle"),
          });
        ioInstance.emit(`driver_response_${bookingId}_${driverId}`, true);
      } catch (err) {
        console.error(err);
        socket.emit("booking_error", { message: "Error" });
      }
    });

    socket.on("reject_booking", async (data) => {
      const { bookingId, driverId } = data;
      await User.findByIdAndUpdate(driverId, { status: USER_STATUS.AVAILABLE });
      ioInstance.emit(`driver_response_${bookingId}_${driverId}`, false);
    });

    socket.on("driver_location", async (data) => {
      try {
        const { driverId, coordinates, currentBookingId } = data;
        await User.findByIdAndUpdate(driverId, {
          location: { type: "Point", coordinates },
          lastActiveAt: new Date(),
        });
        if (currentBookingId) {
          await Booking.findByIdAndUpdate(currentBookingId, {
            driverLocation: { type: "Point", coordinates },
          });
          const booking = await Booking.findById(currentBookingId);
          if (booking) {
            const passengerSocket = passengerSockets.get(
              booking.passenger.toString()
            );
            if (passengerSocket)
              passengerSocket.emit("driver_location_update", {
                bookingId: currentBookingId,
                location: coordinates,
              });
          }
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("disconnect", () => {
      if (socket.driverId) driverSockets.delete(socket.driverId);
      if (socket.passengerId) passengerSockets.delete(socket.passengerId);
    });

    socket.on("cancel_booking", async (data) => {
      try {
        const { bookingId, passengerId } = data;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          socket.emit("booking_error", { message: "Booking not found" });
          return;
        }

        // Check if the passenger is authorized
        if (booking.passenger.toString() !== passengerId) {
          socket.emit("booking_error", {
            message: "Unauthorized to cancel this booking",
          });
          return;
        }

        // Only allow cancellation for certain statuses
        const allowedStatuses = [
          BOOKING_STATUS.PENDING,
          BOOKING_STATUS.ASSIGNED,
        ];
        if (!allowedStatuses.includes(booking.status)) {
          socket.emit("booking_error", {
            message: "Booking cannot be cancelled at this stage",
          });
          return;
        }

        // Update booking status
        booking.status = BOOKING_STATUS.CANCELLED;
        booking.cancelledAt = new Date();
        await booking.save();

        // Notify driver if assigned
        const driverSocket = driverSockets.get(
          booking.assignedDriver?.toString()
        );
        if (driverSocket) {
          driverSocket.emit("booking_cancelled", { bookingId });
          // Optionally, set driver status back to AVAILABLE
          await User.findByIdAndUpdate(booking.assignedDriver, {
            status: USER_STATUS.AVAILABLE,
          });
        }

        // Optionally, notify passenger
        socket.emit("booking_cancelled_success", { bookingId });
      } catch (err) {
        console.error("cancel_booking error", err);
        socket.emit("booking_error", { message: "Error cancelling booking" });
      }
    });
  });
}
async function assignDriverToBookingSync(bookingId) {
  return await assignDriverToBooking(bookingId); // just await the same logic
}
async function tryAssignDriver(bookingId) {
  setImmediate(() =>
    assignDriverToBooking(bookingId).catch((err) => console.error(err))
  );
}

module.exports = {
  initSockets,
  tryAssignDriver,
  driverSockets,
  passengerSockets,
  assignDriverToBookingSync,
};
