const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🟢 1. Driver/Owner payouts 
    const payouts = await Payment.find({ payoutTo: userId })
      .populate({
        path: "booking",
        select: "pickup drop fare passenger assignedDriver vehicleType preferredVehicleModel distanceKm", // Added vehicleType
        populate: [
          { path: "passenger", select: "name email phone" },
          { path: "assignedDriver", select: "name email phone" }
        ]
      })
      .populate({ path: "payoutTo", select: "name email phone" })
      .sort({ createdAt: -1 });

    const driverOwnerTotals = {
      totalAmount: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
      totalBookings: new Set(
        payouts.map(p => p.booking?._id?.toString()).filter(Boolean)
      ).size
    };

    // 🟢 2. Passenger payments (only show what THEY paid to others)
    const passengerBookings = await Booking.find({ passenger: userId })
      .select("_id pickup drop fare assignedDriver vehicleType preferredVehicleModel distanceKm") // Added vehicleType
      .populate("assignedDriver", "name email phone");

    const passengerBookingIds = passengerBookings.map(b => b._id);

    const passengerPaymentsRaw = await Payment.find({
      booking: { $in: passengerBookingIds },
      payoutTo: { $ne: null }
    }).populate({
      path: "booking", 
      select: "pickup drop fare assignedDriver vehicleType preferredVehicleModel distanceKm", // Added vehicleType
      populate: { path: "assignedDriver", select: "name email phone" }
    });

    const passengerPayments = Object.values(
      passengerPaymentsRaw.reduce((acc, payment) => {
        const bid = payment.booking._id.toString();
        if (!acc[bid]) {
          acc[bid] = {
            booking: payment.booking,
            driver: payment.booking.assignedDriver,
            amount: 0,
            status: payment.status || "completed",
            createdAt: payment.createdAt,
            completedAt: payment.completedAt
          };
        }
        acc[bid].amount += payment.amount || 0;
        return acc;
      }, {})
    );

    const passengerTotals = {
      totalSent: passengerPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      totalBookings: new Set(passengerPayments.map(p => p.booking?._id?.toString())).size
    };

    // 🟢 3. Unique passenger count for driver/owner stats
    const uniquePassengers = new Set(
      payouts.map(p => p.booking?.passenger?._id?.toString()).filter(Boolean)
    ).size;

    // 🟢 4. Return combined response but role-aware
    res.json({
      payouts,
      passengerPayments,
      totals: {
        totalReceived: driverOwnerTotals.totalAmount,
        totalSent: passengerTotals.totalSent,
        driverOwner: driverOwnerTotals,
        passenger: passengerTotals
      },
      stats: {
        totalPassengers: uniquePassengers
      }
    });

  } catch (err) {
    console.error("getMyTransactions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getMyTransactions };
