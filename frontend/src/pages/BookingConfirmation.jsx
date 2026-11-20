
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — BOOKING CONFIRMATION */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  BusFront,
  CalendarDays,
  Clock3,
  Ticket,
  ShieldCheck,
} from "lucide-react";

import "../styles/BookingConfirmation.css";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};
  const booking = data.booking;

  if (!booking?.bookingReference) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-card">
          <h2>Booking details unavailable</h2>
          <p>Please check your bookings to see the latest status.</p>
          <button onClick={() => navigate("/my-bookings")}>
            My Bookings
          </button>
        </div>
      </main>
    );
  }

  const expiresAt = booking.expiresAt
    ? new Date(booking.expiresAt).toLocaleString("en-IN")
    : "Not available";

  return (
    <main className="confirmation-page">
      <section className="confirmation-card">

        <div className="confirmation-success-icon">
          <CheckCircle2 size={52} />
        </div>

        <h1>Seats Reserved!</h1>
        <p className="confirmation-subtitle">
          Your seats have been reserved successfully.
        </p>

        <div className="confirmation-reference">
          <span>BOOKING REFERENCE</span>
          <strong>{booking.bookingReference}</strong>
        </div>

        <div className="confirmation-details">
          <h2>Journey Details</h2>

          <div className="confirmation-row">
            <span><BusFront size={17} /> Bus</span>
            <strong>{data.busName || "Selected Bus"}</strong>
          </div>

          <div className="confirmation-row">
            <span>Route</span>
            <strong>{data.from || "—"} → {data.to || "—"}</strong>
          </div>

          <div className="confirmation-row">
            <span><Clock3 size={17} /> Departure</span>
            <strong>{data.departureTime || "—"}</strong>
          </div>

          <div className="confirmation-row">
            <span><Ticket size={17} /> Seats</span>
            <strong>{booking.seats?.join(", ") || "—"}</strong>
          </div>

          <div className="confirmation-row">
            <span><CalendarDays size={17} /> Reservation expires</span>
            <strong>{expiresAt}</strong>
          </div>
        </div>

        <div className="confirmation-total">
          <span>Total Fare</span>
          <strong>
            ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="confirmation-status">
          <ShieldCheck size={19} />
          <div>
            <strong>Reservation: {booking.status}</strong>
            <span>Payment: {booking.paymentStatus}</span>
          </div>
        </div>

        <p className="confirmation-payment-note">
          Complete payment within 10 minutes to confirm your booking.
          Your seats are currently reserved, not yet paid or ticketed.
        </p>

        <button
          className="confirmation-primary-button"
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </button>

        <button
          className="confirmation-secondary-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </section>
    </main>
  );
}
