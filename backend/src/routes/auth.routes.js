
import express from "express";

import {
  requestOTP,
  verifyOTP,
  getMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Request OTP
router.post("/request-otp", requestOTP);

// Verify OTP and generate JWT
router.post("/verify-otp", verifyOTP);

// Get currently logged-in user
router.get("/me", protect, getMe);

export default router;
