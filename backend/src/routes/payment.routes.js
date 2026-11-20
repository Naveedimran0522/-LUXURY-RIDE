
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PAYMENT ROUTES
*/

import express from "express";

import {
  createCheckoutSession,
  verifyCheckoutSession,
  cancelCheckout,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create Stripe Checkout
router.post(
  "/create-checkout-session",
  protect,
  createCheckoutSession
);

// Verify Stripe payment
router.post(
  "/verify-checkout-session",
  protect,
  verifyCheckoutSession
);

// Short alias for frontend compatibility
router.post(
  "/verify",
  protect,
  verifyCheckoutSession
);

// Cancel checkout
router.post(
  "/cancel-checkout",
  protect,
  cancelCheckout
);

export default router;
