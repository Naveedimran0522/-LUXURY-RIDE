
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — DEMO BUS DATA SEEDER
12 CITIES
ALL ROUTE DIRECTIONS
365 DAYS
2 BUSES PER ROUTE / DATE
LEGACY MONGODB COMPATIBLE
*/

import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import Bus from "../models/Bus.js";

// ==========================================
// CONFIGURATION
// ==========================================

const DAYS_TO_GENERATE = 365;
const BATCH_SIZE = 1000;

const CITIES = [
  "Hyderabad",
  "Bangalore",
  "Mumbai",
  "Pune",
  "Chennai",
  "Delhi",
  "Vijayawada",
  "Goa",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Kochi",
];

const BUS_VARIANTS = [
  {
    busName: "Premium AC Sleeper",
    operatorName: "LuxRide Premium",
    busType: "AC Sleeper",
    departureTime: "20:00",
    durationHours: 10,
    fare: 1299,
  },
  {
    busName: "Luxury Volvo",
    operatorName: "LuxRide Travels",
    busType: "Volvo Multi-Axle",
    departureTime: "22:00",
    durationHours: 9,
    fare: 1599,
  },
];

// ==========================================
// DATE HELPERS
// ==========================================

function getISTToday() {
  const now = new Date();
  const ist = new Date(now.getTime() + 330 * 60 * 1000);

  return new Date(
    Date.UTC(
      ist.getUTCFullYear(),
      ist.getUTCMonth(),
      ist.getUTCDate()
    )
  );
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getISTMidnight(date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ) - 330 * 60 * 1000
  );
}

function getArrivalTime(departureTime, durationHours) {
  const [hours, minutes] = departureTime
    .split(":")
    .map(Number);

  const totalMinutes =
    hours * 60 + minutes + durationHours * 60;

  const arrivalHours =
    Math.floor(totalMinutes / 60) % 24;

  const arrivalMinutes = totalMinutes % 60;

  return (
    String(arrivalHours).padStart(2, "0") +
    ":" +
    String(arrivalMinutes).padStart(2, "0")
  );
}

// ==========================================
// SEAT GENERATOR
// ==========================================

function generateSeats() {
  const seats = [];

  for (let i = 1; i <= 15; i++) {
    seats.push(`A${i}`);
  }

  for (let i = 1; i <= 15; i++) {
    seats.push(`B${i}`);
  }

  return seats;
}

// ==========================================
// MAIN SEED FUNCTION
// ==========================================

async function seedDemoBuses() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in backend .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("\n================================");
    console.log("LUXRIDE DEMO DATA GENERATOR");
    console.log("================================\n");

    const collection = Bus.collection;

    // Search index
    await collection.createIndex({
      from: 1,
      to: 1,
      travelDate: 1,
    });

    // Unique demo identifier
    await collection.createIndex(
      { demoKey: 1 },
      { unique: true, sparse: true }
    );

    // Existing route/date combinations
    const existingBuses = await collection
      .find(
        {},
        {
          projection: {
            from: 1,
            to: 1,
            travelDate: 1,
          },
        }
      )
      .toArray();

    const existingSlots = new Set();

    for (const bus of existingBuses) {
      if (!bus.from || !bus.to || !bus.travelDate) {
        continue;
      }

      const date = new Date(bus.travelDate);

      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const istDate = new Date(
        date.getTime() + 330 * 60 * 1000
      );

      const dateKey = formatDateKey(istDate);

      existingSlots.add(
        `${bus.from}|${bus.to}|${dateKey}`
      );
    }

    console.log("Existing buses:", existingBuses.length);
    console.log("Cities:", CITIES.length);
    console.log("Days:", DAYS_TO_GENERATE);
    console.log("Starting generation...\n");

    const today = getISTToday();

    let batch = [];
    let insertedCount = 0;
    let skippedCount = 0;

    const seats = generateSeats();

    // ======================================
    // GENERATE ALL ROUTES AND DATES
    // ======================================

    for (let day = 0; day < DAYS_TO_GENERATE; day++) {
      const calendarDate = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() + day
        )
      );

      const dateKey = formatDateKey(calendarDate);
      const travelDate = getISTMidnight(calendarDate);

      for (const from of CITIES) {
        for (const to of CITIES) {
          // Same city route not allowed
          if (from === to) continue;

          const slotKey = `${from}|${to}|${dateKey}`;

          // Do not duplicate existing route/date
          if (existingSlots.has(slotKey)) {
            skippedCount++;
            continue;
          }

          const routeIndex =
            CITIES.indexOf(from) + CITIES.indexOf(to);

          for (
            let variantIndex = 0;
            variantIndex < BUS_VARIANTS.length;
            variantIndex++
          ) {
            const variant = BUS_VARIANTS[variantIndex];

            const bus = {
              busName: variant.busName,
              operatorName: variant.operatorName,
              busType: variant.busType,

              from,
              to,

              departureTime: variant.departureTime,

              arrivalTime: getArrivalTime(
                variant.departureTime,
                variant.durationHours
              ),

              duration:
                `${variant.durationHours}h 0m`,

              travelDate,

              // Legacy booking-compatible fields
              fare:
                variant.fare + (routeIndex % 5) * 100,

              totalSeats: 30,

              availableSeatNumbers: [...seats],

              amenities: [
                "WiFi",
                "Charging Point",
                "Water Bottle",
                "Reading Light",
                "Blanket",
                "Live Tracking",
              ],

              boardingPoints: [
                `${from} Central Bus Station`,
                `${from} Main Bus Stop`,
              ],

              droppingPoints: [
                `${to} Central Bus Station`,
                `${to} Main Bus Stop`,
              ],

              isActive: true,

              demoData: true,

              demoKey:
                `luxride-${from}-${to}-${dateKey}-${variantIndex}`
                  .toLowerCase()
                  .replace(/\s+/g, "-"),

              createdAt: new Date(),
              updatedAt: new Date(),
            };

            batch.push(bus);

            // Reserve this route/date for this run
            existingSlots.add(slotKey);

            if (batch.length >= BATCH_SIZE) {
              const result = await collection.insertMany(
                batch,
                { ordered: false }
              );

              insertedCount += result.insertedCount;
              batch = [];

              console.log(
                `Inserted: ${insertedCount}`
              );
            }
          }
        }
      }
    }

    // Insert remaining records
    if (batch.length > 0) {
      const result = await collection.insertMany(
        batch,
        { ordered: false }
      );

      insertedCount += result.insertedCount;
    }

    console.log("\n================================");
    console.log("DEMO DATA GENERATION COMPLETE");
    console.log("================================");

    console.log("Inserted buses:", insertedCount);
    console.log("Skipped existing route/date:", skippedCount);

    console.log(
      "Total buses in database:",
      await collection.countDocuments()
    );

    console.log("\nAvailable cities:");
    console.log(CITIES.join(", "));

  } catch (error) {
    console.error("\nDEMO SEED ERROR:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoBuses();
