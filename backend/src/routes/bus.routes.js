
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — BUS ROUTES
*/

import express from "express";

import {
  getBusCities,
  searchBuses,
  getBusById,
} from "../controllers/bus.controller.js";

const router = express.Router();

// Dynamic cities
router.get("/cities", getBusCities);

// Search buses
router.get("/search", searchBuses);

// Bus details
router.get("/:id", getBusById);

export default router;
