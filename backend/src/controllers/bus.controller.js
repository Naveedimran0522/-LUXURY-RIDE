
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — BUS CONTROLLER
DYNAMIC CITIES + SINGLE DATE + DATE RANGE
UNLIMITED FUTURE DATES
IST DATE HANDLING
LEGACY MONGODB SUPPORT
*/

import mongoose from "mongoose";
import Bus from "../models/Bus.js";

// ==========================================
// ESCAPE REGEX
// ==========================================

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ==========================================
// VALIDATE DATE
// ==========================================

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// ==========================================
// GET CURRENT IST DATE
// ==========================================

function getTodayIST() {
  const now = new Date();

  const istDate = new Date(
    now.getTime() + 330 * 60 * 1000
  );

  return istDate.toISOString().slice(0, 10);
}

// ==========================================
// IST DATE RANGE
// START INCLUSIVE, END EXCLUSIVE
// ==========================================

function getISTDateRange(dateFrom, dateTo) {
  const [startYear, startMonth, startDay] =
    dateFrom.split("-").map(Number);

  const [endYear, endMonth, endDay] =
    dateTo.split("-").map(Number);

  const start = new Date(
    Date.UTC(startYear, startMonth - 1, startDay) -
      330 * 60 * 1000
  );

  const endExclusive = new Date(
    Date.UTC(endYear, endMonth - 1, endDay + 1) -
      330 * 60 * 1000
  );

  return { start, endExclusive };
}

// ==========================================
// FORMAT LEGACY BUS
// ==========================================

function formatBus(bus) {
  const availableSeatNumbers = Array.isArray(
    bus.availableSeatNumbers
  )
    ? bus.availableSeatNumbers
    : [];

  const price =
    typeof bus.price === "number"
      ? bus.price
      : typeof bus.fare === "number"
      ? bus.fare
      : 0;

  const availableSeats =
    typeof bus.availableSeats === "number"
      ? bus.availableSeats
      : availableSeatNumbers.length;

  return {
    ...bus,

    _id: String(bus._id),

    price,
    fare: price,

    availableSeats,
    availableSeatNumbers,

    isActive: bus.isActive !== false,
  };
}

// ==========================================
// GET DYNAMIC BUS CITIES
// ==========================================

export async function getBusCities(req, res) {
  try {
    const filter = {
      isActive: { $ne: false },
    };

    const [fromCities, toCities] = await Promise.all([
      Bus.collection.distinct("from", filter),
      Bus.collection.distinct("to", filter),
    ]);

    const cities = [
      ...new Set(
        [...fromCities, ...toCities]
          .filter(
            (city) =>
              typeof city === "string" &&
              city.trim().length > 0
          )
          .map((city) => city.trim())
      ),
    ].sort((a, b) => a.localeCompare(b));

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    console.error("GET BUS CITIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load bus cities.",
    });
  }
}

// ==========================================
// SEARCH BUSES
// SINGLE DATE + DATE RANGE
// ANY FUTURE DATE
// ==========================================

export async function searchBuses(req, res) {
  try {
    const {
      from,
      to,
      date,
      dateFrom,
      dateTo,
    } = req.query;

    const cleanFrom =
      typeof from === "string" ? from.trim() : "";

    const cleanTo =
      typeof to === "string" ? to.trim() : "";

    const cleanDateFrom =
      typeof dateFrom === "string" && dateFrom.trim()
        ? dateFrom.trim()
        : typeof date === "string"
        ? date.trim()
        : "";

    const cleanDateTo =
      typeof dateTo === "string" && dateTo.trim()
        ? dateTo.trim()
        : typeof date === "string" && date.trim()
        ? date.trim()
        : cleanDateFrom;

    // REQUIRED FIELDS

    if (
      !cleanFrom ||
      !cleanTo ||
      !cleanDateFrom ||
      !cleanDateTo
    ) {
      return res.status(400).json({
        success: false,
        message: "From, To and journey date are required.",
      });
    }

    // SAME CITY VALIDATION

    if (
      cleanFrom.toLowerCase() ===
      cleanTo.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be the same.",
      });
    }

    // DATE VALIDATION

    if (
      !isValidDate(cleanDateFrom) ||
      !isValidDate(cleanDateTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid journey date.",
      });
    }

    // PAST DATE VALIDATION

    const today = getTodayIST();

    if (cleanDateFrom < today) {
      return res.status(400).json({
        success: false,
        message: "Past journey dates are not allowed.",
      });
    }

    if (cleanDateTo < cleanDateFrom) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date.",
      });
    }

    // IST DATE RANGE

    const { start, endExclusive } = getISTDateRange(
      cleanDateFrom,
      cleanDateTo
    );

    // RAW MONGODB QUERY

    const query = {
      from: {
        $regex: `^${escapeRegex(cleanFrom)}$`,
        $options: "i",
      },

      to: {
        $regex: `^${escapeRegex(cleanTo)}$`,
        $options: "i",
      },

      travelDate: {
        $gte: start,
        $lt: endExclusive,
      },

      isActive: {
        $ne: false,
      },
    };

    console.log("LUXRIDE BUS SEARCH:", {
      from: cleanFrom,
      to: cleanTo,
      dateFrom: cleanDateFrom,
      dateTo: cleanDateTo,
      start,
      endExclusive,
    });

    const buses = await Bus.collection
      .find(query)
      .sort({
        travelDate: 1,
        departureTime: 1,
      })
      .toArray();

    const formattedBuses = buses.map(formatBus);

    console.log(
      "LUXRIDE MATCHING BUSES:",
      formattedBuses.length
    );

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      count: formattedBuses.length,

      search: {
        from: cleanFrom,
        to: cleanTo,
        dateFrom: cleanDateFrom,
        dateTo: cleanDateTo,
      },

      buses: formattedBuses,
    });
  } catch (error) {
    console.error("SEARCH BUSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search buses.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}

// ==========================================
// GET BUS BY ID
// ==========================================

export async function getBusById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bus ID.",
      });
    }

    const bus = await Bus.collection.findOne({
      _id: new mongoose.Types.ObjectId(id),
      isActive: { $ne: false },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found.",
      });
    }

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      bus: formatBus(bus),
    });
  } catch (error) {
    console.error("GET BUS BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bus details.",
    });
  }
}
