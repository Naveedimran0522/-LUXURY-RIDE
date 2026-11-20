
/*
Bismillah-ir-Rahman-ir-Raheem ❤️
LUXRIDE — BOOKING CONTROLLER
MY BOOKINGS — MONGODB LEGACY BUS SUPPORT
*/

import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

// ==========================================
// GET MY BOOKINGS
// ==========================================

export async function getMyBookings(req, res) {
  try {
    // Check authenticated user
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to view your bookings.",
      });
    }

    // Fetch user's bookings
    const bookings = await Booking.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        bookings: [],
      });
    }

    // Collect bus IDs
    const busIds = [
      ...new Set(
        bookings
          .filter((booking) => booking.bus)
          .map((booking) => String(booking.bus))
      ),
    ];

    // Fetch actual raw MongoDB bus documents
    const buses = await Bus.collection
      .find({
        _id: {
          $in: bookings
            .filter((booking) => booking.bus)
            .map((booking) => booking.bus),
        },
      })
      .toArray();

    // Create bus lookup map
    const busMap = new Map(
      buses.map((bus) => [
        String(bus._id),
        bus,
      ])
    );

    // Attach bus details to each booking
    const formattedBookings = bookings.map((booking) => {
      const bus = booking.bus
        ? busMap.get(String(booking.bus))
        : null;

      return {
        ...booking,

        from: bus?.from || booking.from || "N/A",
        to: bus?.to || booking.to || "N/A",

        bus: bus
          ? {
              _id: bus._id,
              busName:
                bus.busName ||
                bus.name ||
                bus.operatorName ||
                "Bus",

              operatorName: bus.operatorName || "N/A",
              busType: bus.busType || "N/A",

              from: bus.from || "N/A",
              to: bus.to || "N/A",

              departureTime: bus.departureTime || "N/A",
              arrivalTime: bus.arrivalTime || "N/A",

              travelDate:
                bus.travelDate || booking.journeyDate,

              fare: bus.fare ?? bus.price ?? 0,
            }
          : null,
      };
    });

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });

  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your bookings.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}
