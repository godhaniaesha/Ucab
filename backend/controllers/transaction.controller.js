const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // 🟢 If SuperAdmin → calculate platform revenue
    if (userRole === "superadmin") {
      const allPayments = await Payment.find({ status: "completed" })
        .populate({
          path: "booking",
          select:
            "pickup drop fare passenger assignedDriver vehicleType preferredVehicleModel distanceKm",
          populate: [
            { path: "passenger", select: "name email phone" },
            { path: "assignedDriver", select: "name email phone" },
          ],
        })
        .sort({ createdAt: -1 });

      // 🔹 calculate 20% of fare as platform fee
      const totalPlatformFee = allPayments.reduce((sum, p) => {
        const fare = p.booking?.fare || 0;
        return sum + fare * 0.2;
      }, 0);

      return res.json({
        role: "superadmin",
        totalTransactions: allPayments.length,
        totalPlatformFee, // 💰 Platform revenue (20% of fare)
        transactions: allPayments.map((p) => {
          const fare = p.booking?.fare || 0;
          const platformFee = fare * 0.2;
          const driverEarning = fare * 0.8;

          return {
            booking: p.booking,
            fare,
            platformFee,
            driverEarning,
            amountPaid: p.amount,
            payoutTo: p.payoutTo, // driver/owner
            status: p.status,
            createdAt: p.createdAt,
            completedAt: p.completedAt,
          };
        }),
      });
    }

    // 🟢 Driver/Owner payouts
    const payouts = await Payment.find({ payoutTo: userId })
      .populate({
        path: "booking",
        select:
          "pickup drop fare passenger assignedDriver vehicleType preferredVehicleModel distanceKm",
        populate: [
          { path: "passenger", select: "name email phone" },
          { path: "assignedDriver", select: "name email phone" },
        ],
      })
      .populate({ path: "payoutTo", select: "name email phone" })
      .sort({ createdAt: -1 });

    const driverOwnerTotals = {
      totalAmount: payouts.reduce((sum, p) => sum + (p.amount || 0), 0),
      totalBookings: new Set(
        payouts.map((p) => p.booking?._id?.toString()).filter(Boolean)
      ).size,
    };

    // 🟢 Passenger payments
    const passengerBookings = await Booking.find({ passenger: userId })
      .select(
        "_id pickup drop fare assignedDriver vehicleType preferredVehicleModel distanceKm"
      )
      .populate("assignedDriver", "name email phone");

    const passengerBookingIds = passengerBookings.map((b) => b._id);

    const passengerPaymentsRaw = await Payment.find({
      booking: { $in: passengerBookingIds },
      payoutTo: { $ne: null },
    }).populate({
      path: "booking",
      select:
        "pickup drop fare assignedDriver vehicleType preferredVehicleModel distanceKm",
      populate: { path: "assignedDriver", select: "name email phone" },
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
            completedAt: payment.completedAt,
          };
        }
        acc[bid].amount += payment.amount || 0;
        return acc;
      }, {})
    );

    const passengerTotals = {
      totalSent: passengerPayments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      ),
      totalBookings: new Set(
        passengerPayments.map((p) => p.booking?._id?.toString())
      ).size,
    };

    // 🟢 Unique passenger count for driver/owner stats
    const uniquePassengers = new Set(
      payouts.map((p) => p.booking?.passenger?._id?.toString()).filter(Boolean)
    ).size;

    // 🟢 Normal user response
    res.json({
      payouts,
      passengerPayments,
      totals: {
        totalReceived: driverOwnerTotals.totalAmount,
        totalSent: passengerTotals.totalSent,
        driverOwner: driverOwnerTotals,
        passenger: passengerTotals,
      },
      stats: {
        totalPassengers: uniquePassengers,
      },
    });
  } catch (err) {
    console.error("getMyTransactions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getMyTransactions };
