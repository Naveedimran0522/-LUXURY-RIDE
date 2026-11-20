
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — BOOKING MODEL
STRIPE PAYMENT SUPPORT
NO QR TICKET SUPPORT
*/

import mongoose from "mongoose";

// ==========================================
// PASSENGER SCHEMA
// ==========================================

const passengerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// ==========================================
// BOOKING SCHEMA
// ==========================================

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    journeyDate: {
      type: Date,
      required: true,
    },

    passengers: {
      type: [passengerSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one passenger is required.",
      },
    },

    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (value) =>
          value.length > 0 &&
          new Set(value).size === value.length,

        message: "Seats must be non-empty and unique.",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "cancelled",
      ],
      default: "pending_payment",
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    stripeSessionId: {
      type: String,
      default: null,
    },

    paymentIntentId: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// NO QR TOKEN INDEX
// NO TTL INDEX
// ==========================================

const Booking =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);

export default Booking;
