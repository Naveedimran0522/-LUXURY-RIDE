
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — MAIN APPLICATION
COMPLETE ROUTING SYSTEM
STRIPE PAYMENT ROUTES
MY BOOKINGS FIX
*/

import { useState, useCallback } from "react";

import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// ======================================================
// ONBOARDING
// ======================================================

import SplashScreen from "./components/onboarding/SplashScreen";
import Onboarding from "./components/onboarding/Onboarding";

// ======================================================
// NAVIGATION
// ======================================================

import BottomNav from "./components/navigation/BottomNav";

// ======================================================
// AUTHENTICATION
// ======================================================

import ProtectedRoute from "./components/auth/ProtectedRoute";

// ======================================================
// PAGES
// ======================================================

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";

import BusDetails from "./pages/BusDetails";
import PassengerDetails from "./pages/PassengerDetails";

import BookingConfirmation from "./pages/BookingConfirmation";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// ======================================================
// STYLES
// ======================================================

import "./styles/profile.css";
import "./styles/auth.css";

// ======================================================
// PLACEHOLDER PAGE
// ======================================================

function Placeholder({ title }) {
  return (
    <main className="min-h-screen bg-[#0b1511] text-white flex items-center justify-center px-5">

      <div className="text-center">

        <h1 className="playfair text-3xl md:text-4xl text-[#c5a66b] mb-4">
          {title}
        </h1>

        <p className="text-gray-400 text-sm">
          This section is coming soon.
        </p>

      </div>

    </main>
  );
}

// ======================================================
// NOT FOUND PAGE
// ======================================================

function NotFound() {
  return (
    <main className="min-h-screen bg-[#0b1511] text-white flex items-center justify-center px-5">

      <div className="text-center">

        <h1 className="playfair text-6xl text-[#c5a66b] mb-5">
          404
        </h1>

        <h2 className="text-2xl mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          className="inline-block px-8 py-3 rounded-full bg-[#c5a66b] text-[#13221a] font-semibold hover:bg-[#d8bc86] transition"
        >
          Back to Home
        </a>

      </div>

    </main>
  );
}

// ======================================================
// MAIN APP
// ======================================================

export default function App() {

  const [stage, setStage] = useState(() => {

    return sessionStorage.getItem("luxride-intro-complete") === "true"
      ? "app"
      : "splash";

  });

  const location = useLocation();

  // ====================================================
  // COMPLETE INTRO
  // ====================================================

  const completeIntro = useCallback(() => {

    sessionStorage.setItem("luxride-intro-complete", "true");

    setStage("app");

  }, []);

  // ====================================================
  // SPLASH SCREEN
  // ====================================================

  if (stage === "splash") {

    return (
      <SplashScreen
        onComplete={() => setStage("onboarding")}
      />
    );

  }

  // ====================================================
  // ONBOARDING
  // ====================================================

  if (stage === "onboarding") {

    return (
      <Onboarding
        onComplete={completeIntro}
      />
    );

  }

  // ====================================================
  // ROUTE CHECKS
  // ====================================================

  const pathname = location.pathname;

  const isHome = pathname === "/";

  const hideBottomNav =
    pathname.startsWith("/payment") ||
    pathname === "/passenger-details" ||
    pathname === "/booking-confirmation" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-otp";

  // ====================================================
  // MAIN ROUTES
  // ====================================================

  return (

    <>

      <Routes>

        {/* ==========================================
            HOME
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* ==========================================
            EXPLORE
        ========================================== */}

        <Route
          path="/explore"
          element={
            <Placeholder title="Explore Journeys" />
          }
        />

        {/* ==========================================
            SEARCH
        ========================================== */}

        <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route
          path="/buses"
          element={
            <Navigate to="/search" replace />
          }
        />

        <Route
          path="/browse-buses"
          element={
            <Navigate to="/search" replace />
          }
        />

        {/* ==========================================
            BUS DETAILS
        ========================================== */}

        <Route
          path="/bus/:id"
          element={<BusDetails />}
        />

        {/* ==========================================
            MY BOOKINGS
        ========================================== */}

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Backward-compatible My Bookings URL */}

        <Route
          path="/my-bookings"
          element={
            <Navigate to="/bookings" replace />
          }
        />

        {/* ==========================================
            SAVED TRIPS
        ========================================== */}

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Placeholder title="Saved Trips" />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            PROFILE
        ========================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <Navigate to="/profile" replace />
          }
        />

        {/* ==========================================
            SETTINGS
        ========================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Placeholder title="Account Settings" />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            PASSENGER DETAILS
        ========================================== */}

        <Route
          path="/passenger-details"
          element={
            <ProtectedRoute>
              <PassengerDetails />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            BOOKING CONFIRMATION
        ========================================== */}

        <Route
          path="/booking-confirmation"
          element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            PAYMENT SUCCESS
        ========================================== */}

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            PAYMENT CANCEL
        ========================================== */}

        <Route
          path="/payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            AUTHENTICATION
        ========================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        {/* ==========================================
            404 PAGE
        ========================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      {/* ==========================================
          BOTTOM NAVIGATION
      ========================================== */}

      {isHome && !hideBottomNav && (
        <BottomNav />
      )}

    </>

  );

}
