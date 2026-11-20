
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — BUS MODEL
LEGACY MONGODB + NEW BUS SUPPORT
*/

import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    // BUS OPERATOR DETAILS
    operatorName: {
      type: String,
      required: true,
      trim: true,
    },

    busName: {
      type: String,
      required: true,
      trim: true,
    },

    busType: {
      type: String,
      required: true,
      trim: true,
      default: "AC Sleeper",
    },

    // ROUTE DETAILS
    from: {
      type: String,
      required: true,
      trim: true,
    },

    to: {
      type: String,
      required: true,
      trim: true,
    },

    departureTime: {
      type: String,
      required: true,
      trim: true,
    },

    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      default: "",
      trim: true,
    },

    travelDate: {
      type: Date,
      required: true,
    },

    // PRICING
    price: {
      type: Number,
      min: 0,
    },

    // LEGACY PRICE SUPPORT
    fare: {
      type: Number,
      min: 0,
    },

    // SEAT COUNT
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      min: 0,
    },

    // LEGACY SEAT SUPPORT
    availableSeatNumbers: {
      type: [String],
      default: undefined,
    },

    // AMENITIES
    amenities: {
      type: [String],
      default: [],
    },

    // BOARDING POINTS
    boardingPoints: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        time: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // DROPPING POINTS
    droppingPoints: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        time: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // INDIVIDUAL BUS SEATS
    seats: [
      {
        seatNumber: {
          type: String,
          required: true,
          trim: true,
        },

        seatType: {
          type: String,
          enum: ["seater", "sleeper"],
          default: "sleeper",
        },

        deck: {
          type: String,
          enum: ["lower", "upper"],
          default: "lower",
        },

        price: {
          type: Number,
          min: 0,
        },

        status: {
          type: String,
          enum: ["available", "reserved", "booked"],
          default: "available",
        },

        reservedUntil: {
          type: Date,
          default: null,
        },

        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
          default: null,
        },
      },
    ],

    // BUS STATUS
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// INDEXES
busSchema.index({
  from: 1,
  to: 1,
  travelDate: 1,
  isActive: 1,
});

busSchema.index({
  travelDate: 1,
  isActive: 1,
});

// MODEL EXPORT
const Bus = mongoose.models.Bus || mongoose.model("Bus", busSchema);

export default Bus;
