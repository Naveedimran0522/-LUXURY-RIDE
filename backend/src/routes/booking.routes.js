
/*
Bismillah-ir-Rahman-ir-Raheem ❤️
LUXRIDE — BOOKING ROUTES
*/

import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  getMyBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyBookings);

export default router;
