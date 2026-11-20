
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — COMPLETE PAYMENT CONTROLLER
LEGACY + NEW BUS SEAT SUPPORT
STRIPE DYNAMIC PAYMENT METHODS
BOOKING + PAYMENT VERIFICATION
NO QR TICKET SUPPORT
*/

import mongoose from "mongoose";
import crypto from "crypto";
import Stripe from "stripe";

import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";

// ======================================================
// CONFIGURATION
// ======================================================

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const HOLD_MINUTES = 30;
const HOLD_TIME_MS = HOLD_MINUTES * 60 * 1000;

const CLIENT_URL = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/+$/, "");

// ======================================================
// COMMON HELPERS
// ======================================================

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const normalizeSeat = (seat) =>
  String(seat || "").trim().toUpperCase();

const generateBookingReference = () => {
  return `LR${Date.now()}${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
};

const getPaymentIntentId = (session) => {
  if (!session.payment_intent) return null;

  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }

  return session.payment_intent.id;
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id || null;
};

// ======================================================
// BUS SEAT SYSTEM DETECTION
// ======================================================

const getSeatSystem = (bus) => {
  if (Array.isArray(bus.availableSeatNumbers)) {
    return "legacy";
  }

  if (Array.isArray(bus.seats)) {
    return "modern";
  }

  return null;
};

// ======================================================
// RESERVE LEGACY SEATS
// ======================================================

const reserveLegacySeats = async ({ busId, seats }) => {
  const objectBusId = new mongoose.Types.ObjectId(busId);

  const bus = await Bus.collection.findOne({
    _id: objectBusId,
  });

  if (!bus || !Array.isArray(bus.availableSeatNumbers)) {
    return false;
  }

  const available = bus.availableSeatNumbers.map(normalizeSeat);

  if (!seats.every((seat) => available.includes(seat))) {
    return false;
  }

  const result = await Bus.collection.updateOne(
    {
      _id: objectBusId,
      availableSeatNumbers: {
        $all: seats,
      },
    },
    [
      {
        $set: {
          availableSeatNumbers: {
            $filter: {
              input: {
                $ifNull: ["$availableSeatNumbers", []],
              },
              as: "seat",
              cond: {
                $not: [
                  {
                    $in: [
                      {
                        $toUpper: {
                          $trim: {
                            input: "$$seat",
                          },
                        },
                      },
                      seats,
                    ],
                  },
                ],
              },
            },
          },

          availableSeats: {
            $max: [
              0,
              {
                $subtract: [
                  {
                    $ifNull: [
                      "$availableSeats",
                      bus.availableSeatNumbers.length,
                    ],
                  },
                  seats.length,
                ],
              },
            ],
          },
        },
      },
    ]
  );

  return result.modifiedCount === 1;
};

// ======================================================
// RESERVE MODERN BUS SEATS
// ======================================================

const reserveModernSeats = async ({
  busId,
  seats,
  bookingId,
  expiresAt,
}) => {
  const objectBusId = new mongoose.Types.ObjectId(busId);
  const now = new Date();

  const eligibleSeatConditions = seats.map((seatNumber) => ({
    seats: {
      $elemMatch: {
        seatNumber,
        $or: [
          {
            status: "available",
          },
          {
            status: "reserved",
            reservedUntil: {
              $lte: now,
            },
          },
        ],
      },
    },
  }));

  const result = await Bus.collection.updateOne(
    {
      _id: objectBusId,
      $and: eligibleSeatConditions,
    },
    {
      $set: {
        "seats.$[seat].status": "reserved",
        "seats.$[seat].reservedUntil": expiresAt,
        "seats.$[seat].bookingId": bookingId,
      },
      $inc: {
        availableSeats: -seats.length,
      },
    },
    {
      arrayFilters: [
        {
          "seat.seatNumber": {
            $in: seats,
          },
        },
      ],
    }
  );

  return result.modifiedCount === 1;
};

// ======================================================
// RESERVE SELECTED SEATS
// ======================================================

const reserveSeats = async ({
  bus,
  seats,
  bookingId,
  expiresAt,
}) => {
  const seatSystem = getSeatSystem(bus);

  if (seatSystem === "legacy") {
    return reserveLegacySeats({
      busId: bus._id,
      seats,
    });
  }

  if (seatSystem === "modern") {
    return reserveModernSeats({
      busId: bus._id,
      seats,
      bookingId,
      expiresAt,
    });
  }

  return false;
};

// ======================================================
// RELEASE LEGACY SEATS
// ======================================================

const releaseLegacySeats = async ({ busId, seats }) => {
  const objectBusId = new mongoose.Types.ObjectId(busId);

  await Bus.collection.updateOne(
    {
      _id: objectBusId,
    },
    [
      {
        $set: {
          availableSeatNumbers: {
            $setUnion: [
              {
                $ifNull: ["$availableSeatNumbers", []],
              },
              seats,
            ],
          },

          availableSeats: {
            $add: [
              {
                $ifNull: ["$availableSeats", 0],
              },
              {
                $size: {
                  $setDifference: [
                    seats,
                    {
                      $ifNull: ["$availableSeatNumbers", []],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ]
  );
};

// ======================================================
// RELEASE MODERN BUS SEATS
// ======================================================

const releaseModernSeats = async ({
  busId,
  seats,
  bookingId,
}) => {
  const objectBusId = new mongoose.Types.ObjectId(busId);

  const bus = await Bus.collection.findOne({
    _id: objectBusId,
  });

  if (!bus || !Array.isArray(bus.seats)) {
    return;
  }

  const matchingSeats = bus.seats.filter(
    (seat) =>
      seats.includes(normalizeSeat(seat.seatNumber)) &&
      String(seat.bookingId) === String(bookingId) &&
      seat.status === "reserved"
  );

  if (!matchingSeats.length) return;

  const seatNumbers = matchingSeats.map(
    (seat) => seat.seatNumber
  );

  await Bus.collection.updateOne(
    {
      _id: objectBusId,
    },
    {
      $set: {
        "seats.$[seat].status": "available",
        "seats.$[seat].reservedUntil": null,
        "seats.$[seat].bookingId": null,
      },
      $inc: {
        availableSeats: seatNumbers.length,
      },
    },
    {
      arrayFilters: [
        {
          "seat.seatNumber": {
            $in: seatNumbers,
          },
          "seat.bookingId": bookingId,
          "seat.status": "reserved",
        },
      ],
    }
  );
};

// ======================================================
// RELEASE BOOKING SEATS
// ======================================================

const releaseBookingSeats = async (booking) => {
  if (!booking?.bus || !booking?.seats?.length) {
    return;
  }

  const bus = await Bus.collection.findOne({
    _id: new mongoose.Types.ObjectId(booking.bus),
  });

  if (!bus) return;

  if (Array.isArray(bus.availableSeatNumbers)) {
    await releaseLegacySeats({
      busId: booking.bus,
      seats: booking.seats,
    });

    return;
  }

  if (Array.isArray(bus.seats)) {
    await releaseModernSeats({
      busId: booking.bus,
      seats: booking.seats,
      bookingId: booking._id,
    });
  }
};

// ======================================================
// EXPIRE BOOKING
// ======================================================

const expireBooking = async (booking) => {
  const updatedBooking = await Booking.findOneAndUpdate(
    {
      _id: booking._id,
      status: "pending_payment",
      paymentStatus: "pending",
      expiresAt: {
        $lte: new Date(),
      },
    },
    {
      $set: {
        status: "cancelled",
        paymentStatus: "failed",
      },
    },
    {
      new: true,
    }
  );

  if (updatedBooking) {
    await releaseBookingSeats(updatedBooking);
  }

  return updatedBooking;
};

// ======================================================
// CLEANUP EXPIRED BOOKINGS
// ======================================================

export const cleanupExpiredBookings = async () => {
  const expiredBookings = await Booking.find({
    status: "pending_payment",
    paymentStatus: "pending",
    expiresAt: {
      $lte: new Date(),
    },
  });

  for (const booking of expiredBookings) {
    try {
      await expireBooking(booking);
    } catch (error) {
      console.error(
        "Expired booking cleanup error:",
        booking._id,
        error.message
      );
    }
  }
};

// ======================================================
// CREATE STRIPE CHECKOUT SESSION
// ======================================================

export const createCheckoutSession = async (req, res) => {
  let booking = null;
  let session = null;
  let seatsReserved = false;

  try {
    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 401, "Please login first.");
    }

    const {
      busId,
      seats: rawSeats,
      passengers,
    } = req.body;

    if (!isValidObjectId(busId)) {
      return sendError(res, 400, "Invalid bus ID.");
    }

    if (
      !Array.isArray(rawSeats) ||
      rawSeats.length < 1 ||
      rawSeats.length > 6
    ) {
      return sendError(
        res,
        400,
        "Select between 1 and 6 seats."
      );
    }

    if (!Array.isArray(passengers)) {
      return sendError(
        res,
        400,
        "Invalid passenger details."
      );
    }

    const seats = rawSeats.map(normalizeSeat);

    if (
      seats.some((seat) => !seat) ||
      new Set(seats).size !== seats.length
    ) {
      return sendError(
        res,
        400,
        "Seats must be valid and unique."
      );
    }

    if (passengers.length !== seats.length) {
      return sendError(
        res,
        400,
        "Passenger count must match selected seats."
      );
    }

    const cleanPassengers = passengers.map(
      (passenger, index) => {
        const name = String(passenger.name || "").trim();
        const age = Number(passenger.age);
        const gender = String(passenger.gender || "").trim();

        if (!name || name.length > 100) {
          throw new Error(
            `Invalid passenger name at passenger ${index + 1}.`
          );
        }

        if (
          !Number.isInteger(age) ||
          age < 1 ||
          age > 120
        ) {
          throw new Error(
            `Invalid passenger age at passenger ${index + 1}.`
          );
        }

        if (!["Male", "Female", "Other"].includes(gender)) {
          throw new Error(
            `Invalid passenger gender at passenger ${index + 1}.`
          );
        }

        return {
          name,
          age,
          gender,
          seatNumber: seats[index],
        };
      }
    );

    await cleanupExpiredBookings();

    // Read actual database document to support legacy buses.
    const bus = await Bus.collection.findOne({
      _id: new mongoose.Types.ObjectId(busId),
      isActive: {
        $ne: false,
      },
    });

    if (!bus) {
      return sendError(
        res,
        404,
        "Bus not found or inactive."
      );
    }

    const seatSystem = getSeatSystem(bus);

    if (!seatSystem) {
      return sendError(
        res,
        400,
        "This bus does not have a supported seat system."
      );
    }

    const fare = Number(bus.fare ?? bus.price);

    if (!Number.isFinite(fare) || fare <= 0) {
      return sendError(res, 400, "Invalid bus fare.");
    }

    if (seatSystem === "modern") {
      const existingSeatNumbers = bus.seats.map(
        (seat) => normalizeSeat(seat.seatNumber)
      );

      if (
        !seats.every((seat) =>
          existingSeatNumbers.includes(seat)
        )
      ) {
        return sendError(
          res,
          400,
          "One or more selected seats do not exist."
        );
      }
    }

    if (seatSystem === "legacy") {
      const existingSeatNumbers =
        bus.availableSeatNumbers.map(normalizeSeat);

      if (
        !seats.every((seat) =>
          existingSeatNumbers.includes(seat)
        )
      ) {
        return sendError(
          res,
          409,
          "One or more selected seats are no longer available."
        );
      }
    }

    const totalAmount = fare * seats.length;
    const expiresAt = new Date(
      Date.now() + HOLD_TIME_MS
    );

    // Create booking before reserving modern seats.
    booking = await Booking.create({
      bookingReference: generateBookingReference(),
      user: userId,
      bus: busId,
      journeyDate: bus.travelDate,
      passengers: cleanPassengers,
      seats,
      totalAmount,
      status: "pending_payment",
      paymentStatus: "pending",
      expiresAt,
    });

    seatsReserved = await reserveSeats({
      bus,
      seats,
      bookingId: booking._id,
      expiresAt,
    });

    if (!seatsReserved) {
      await Booking.deleteOne({
        _id: booking._id,
      });

      booking = null;

      return sendError(
        res,
        409,
        "Selected seats are no longer available. Please select again."
      );
    }

    const sessionExpiresAt = Math.floor(
      expiresAt.getTime() / 1000
    );

    // IMPORTANT:
    // payment_method_types removed.
    // Stripe Dashboard manages enabled payment methods.

    session = await stripe.checkout.sessions.create(
      {
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "inr",

              product_data: {
                name: `${bus.operatorName || "LuxRide"} - ${bus.busName}`,
                description: `${bus.from} to ${bus.to} | Seats: ${seats.join(", ")}`,
              },

              unit_amount: Math.round(fare * 100),
            },

            quantity: seats.length,
          },
        ],

        client_reference_id: String(booking._id),

        metadata: {
          bookingId: String(booking._id),
          userId: String(userId),
        },

        expires_at: sessionExpiresAt,

        success_url:
          `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${CLIENT_URL}/payment-cancel?bookingId=${booking._id}`,
      },
      {
        idempotencyKey: `luxride-checkout-${booking._id}`,
      }
    );

    booking.stripeSessionId = session.id;

    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Checkout session created successfully.",

      checkoutUrl: session.url,

      booking: {
        _id: booking._id,
        bookingReference: booking.bookingReference,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        expiresAt: booking.expiresAt,
      },
    });
  } catch (error) {
    console.error("CREATE CHECKOUT ERROR:", error);

    if (session?.id) {
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (stripeError) {
        console.error(
          "Stripe session expiry error:",
          stripeError.message
        );
      }
    }

    if (booking) {
      try {
        const cancelled = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            status: "pending_payment",
            paymentStatus: "pending",
          },
          {
            $set: {
              status: "cancelled",
              paymentStatus: "failed",
            },
          },
          {
            new: true,
          }
        );

        if (cancelled && seatsReserved) {
          await releaseBookingSeats(cancelled);
        }
      } catch (cleanupError) {
        console.error(
          "Checkout rollback error:",
          cleanupError
        );
      }
    }

    return sendError(
      res,
      500,
      error.message || "Unable to create checkout session."
    );
  }
};

// ======================================================
// CONFIRM MODERN BUS SEATS
// ======================================================

const confirmModernSeats = async (booking) => {
  const busId = new mongoose.Types.ObjectId(booking.bus);

  const result = await Bus.collection.updateOne(
    {
      _id: busId,

      $and: booking.seats.map((seatNumber) => ({
        seats: {
          $elemMatch: {
            seatNumber,
            status: "reserved",
            bookingId: booking._id,
          },
        },
      })),
    },

    {
      $set: {
        "seats.$[seat].status": "booked",
        "seats.$[seat].reservedUntil": null,
      },
    },

    {
      arrayFilters: [
        {
          "seat.seatNumber": {
            $in: booking.seats,
          },
          "seat.bookingId": booking._id,
          "seat.status": "reserved",
        },
      ],
    }
  );

  return result.modifiedCount === 1;
};

// ======================================================
// VERIFY STRIPE CHECKOUT SESSION
// ======================================================

export const verifyCheckoutSession = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return sendError(res, 401, "Please login first.");
    }

    const { sessionId } = req.body;

    if (
      !sessionId ||
      typeof sessionId !== "string"
    ) {
      return sendError(
        res,
        400,
        "Stripe session ID is required."
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    const bookingId = session.metadata?.bookingId;
    const sessionUserId = session.metadata?.userId;

    if (
      !bookingId ||
      !isValidObjectId(bookingId) ||
      String(sessionUserId) !== String(userId) ||
      String(session.client_reference_id) !== String(bookingId)
    ) {
      return sendError(
        res,
        403,
        "Invalid payment session."
      );
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
      stripeSessionId: sessionId,
    });

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (
      session.payment_status !== "paid" ||
      session.status !== "complete"
    ) {
      return sendError(
        res,
        400,
        "Payment has not been completed."
      );
    }

    if (
      Number(session.amount_total) !==
        Math.round(booking.totalAmount * 100) ||
      String(session.currency).toLowerCase() !== "inr"
    ) {
      return sendError(
        res,
        400,
        "Payment amount or currency does not match booking."
      );
    }

    // Idempotent verification.
    if (
      booking.status === "confirmed" &&
      booking.paymentStatus === "paid"
    ) {
      return res.status(200).json({
        success: true,
        alreadyConfirmed: true,
        message: "Payment already verified.",
        booking,
      });
    }

    if (
      booking.status === "cancelled" ||
      booking.expiresAt <= new Date()
    ) {
      const paymentIntentId = getPaymentIntentId(session);

      if (paymentIntentId) {
        try {
          await stripe.refunds.create(
            {
              payment_intent: paymentIntentId,
            },
            {
              idempotencyKey:
                `luxride-refund-${booking._id}`,
            }
          );
        } catch (refundError) {
          console.error(
            "EXPIRED BOOKING REFUND ERROR:",
            refundError
          );
        }
      }

      return sendError(
        res,
        409,
        "Booking expired or cancelled. Refund will be processed if payment was captured."
      );
    }

    const bus = await Bus.collection.findOne({
      _id: new mongoose.Types.ObjectId(booking.bus),
    });

    if (!bus) {
      return sendError(res, 404, "Bus not found.");
    }

    // Confirm modern seats.
    if (Array.isArray(bus.seats)) {
      const seatsConfirmed =
        await confirmModernSeats(booking);

      if (!seatsConfirmed) {
        try {
          const paymentIntentId =
            getPaymentIntentId(session);

          if (paymentIntentId) {
            await stripe.refunds.create(
              {
                payment_intent: paymentIntentId,
              },
              {
                idempotencyKey:
                  `luxride-refund-${booking._id}`,
              }
            );
          }
        } catch (refundError) {
          console.error(
            "SEAT CONFLICT REFUND ERROR:",
            refundError
          );
        }

        return sendError(
          res,
          409,
          "Seat reservation could not be confirmed. Refund will be processed."
        );
      }
    }

    // Legacy seats were already removed during reservation.
    const confirmedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        user: userId,
        stripeSessionId: sessionId,
        status: "pending_payment",
        paymentStatus: "pending",
        expiresAt: {
          $gt: new Date(),
        },
      },

      {
        $set: {
          status: "confirmed",
          paymentStatus: "paid",
          paymentIntentId: getPaymentIntentId(session),
        },
      },

      {
        new: true,
      }
    );

    if (!confirmedBooking) {
      const latestBooking = await Booking.findById(
        booking._id
      );

      if (
        latestBooking?.status === "confirmed" &&
        latestBooking?.paymentStatus === "paid"
      ) {
        return res.status(200).json({
          success: true,
          alreadyConfirmed: true,
          message: "Payment already verified.",
          booking: latestBooking,
        });
      }

      return sendError(
        res,
        409,
        "Booking could not be confirmed. Please contact support."
      );
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed.",
      booking: confirmedBooking,
    });
  } catch (error) {
    console.error("VERIFY CHECKOUT ERROR:", error);

    return sendError(
      res,
      500,
      error.message || "Payment verification failed."
    );
  }
};

// ======================================================
// CANCEL CHECKOUT
// ======================================================

export const cancelCheckout = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { bookingId } = req.body;

    if (!userId) {
      return sendError(res, 401, "Please login first.");
    }

    if (!isValidObjectId(bookingId)) {
      return sendError(res, 400, "Invalid booking ID.");
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return sendError(res, 404, "Booking not found.");
    }

    if (
      booking.status === "confirmed" ||
      booking.paymentStatus === "paid"
    ) {
      return sendError(
        res,
        400,
        "Paid booking cannot be cancelled through checkout cancellation."
      );
    }

    if (booking.status === "cancelled") {
      return res.status(200).json({
        success: true,
        message: "Booking is already cancelled.",
      });
    }

    if (booking.stripeSessionId) {
      let session =
        await stripe.checkout.sessions.retrieve(
          booking.stripeSessionId
        );

      if (session.payment_status === "paid") {
        return sendError(
          res,
          409,
          "Payment is completed. Verify the payment instead."
        );
      }

      if (session.status === "open") {
        await stripe.checkout.sessions.expire(session.id);

        session =
          await stripe.checkout.sessions.retrieve(
            session.id
          );
      }

      if (session.status !== "expired") {
        return sendError(
          res,
          409,
          "Stripe checkout session is not yet expired."
        );
      }
    }

    const cancelledBooking =
      await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          user: userId,
          status: "pending_payment",
          paymentStatus: "pending",
        },

        {
          $set: {
            status: "cancelled",
            paymentStatus: "failed",
          },
        },

        {
          new: true,
        }
      );

    if (cancelledBooking) {
      await releaseBookingSeats(cancelledBooking);
    }

    return res.status(200).json({
      success: true,
      message: "Checkout cancelled and seats released.",
    });
  } catch (error) {
    console.error("CANCEL CHECKOUT ERROR:", error);

    return sendError(
      res,
      500,
      error.message || "Unable to cancel checkout."
    );
  }
};
