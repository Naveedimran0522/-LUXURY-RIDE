
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — MY BOOKINGS
PREMIUM DIGITAL BUS TICKET
VIEW TICKET + DOWNLOAD PDF
*/

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Ticket,
  RefreshCw,
  X,
  Download,
  MapPin,
  CalendarDays,
  Clock,
  BusFront,
  UserRound,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { apiRequest } from "../services/api";
import "./MyBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/bookings/my");

      const data =
        response?.bookings ||
        response?.data?.bookings ||
        [];

      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time) return "N/A";

    if (time instanceof Date) {
      return time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return String(time);
  };

  // CHECK PAYMENT
  const isTicketValid = (booking) => {
    return (
      String(booking?.status || "").toLowerCase() === "confirmed" &&
      String(booking?.paymentStatus || "").toLowerCase() === "paid"
    );
  };

  // OPEN TICKET
  const openTicket = (booking) => {
    setSelectedBooking(booking);
  };

  // CLOSE TICKET
  const closeTicket = () => {
    setSelectedBooking(null);
  };

  // PRINT / SAVE AS PDF
  const downloadTicket = () => {
    if (!selectedBooking || !isTicketValid(selectedBooking)) {
      return;
    }

    window.print();
  };

  // LOADING
  if (loading) {
    return (
      <main className="my-bookings-page">
        <div className="my-bookings-message">
          Loading your bookings...
        </div>
      </main>
    );
  }

  return (
    <main className="my-bookings-page">
      <div className="my-bookings-container">

        {/* PAGE HEADER */}
        <div className="my-bookings-heading">
          <div>
            <span className="my-bookings-eyebrow">
              YOUR JOURNEYS
            </span>

            <h1>My Bookings</h1>

            <p>
              Manage and track all your bus journeys.
            </p>
          </div>

          <button
            className="my-bookings-refresh"
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="my-bookings-error">
            {error}

            <button onClick={fetchBookings}>
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && bookings.length === 0 && (
          <div className="my-bookings-empty">
            <Ticket size={42} />

            <h2>No bookings yet</h2>

            <p>
              Your confirmed and pending bookings will appear here.
            </p>

            <Link to="/search">
              Explore Buses
            </Link>
          </div>
        )}

        {/* BOOKINGS LIST */}
        <div className="my-bookings-list">
          {bookings.map((booking) => {
            const validTicket = isTicketValid(booking);

            const status = String(
              booking?.status || "pending"
            ).toLowerCase();

            return (
              <article
                className="my-booking-card"
                key={
                  booking?._id ||
                  booking?.bookingReference
                }
              >

                {/* BOOKING TOP */}
                <div className="my-booking-top">
                  <div>
                    <span className="my-booking-reference">
                      BOOKING REFERENCE
                    </span>

                    <h2>
                      {booking?.bookingReference || "N/A"}
                    </h2>
                  </div>

                  <span
                    className={`my-booking-status ${status}`}
                  >
                    {booking?.status || "Pending"}
                  </span>
                </div>

                {/* ROUTE */}
                <div className="my-booking-route">
                  <div>
                    <span>FROM</span>

                    <h3>
                      {booking?.from ||
                        booking?.bus?.from ||
                        "N/A"}
                    </h3>
                  </div>

                  <div className="my-booking-route-line">
                    →
                  </div>

                  <div>
                    <span>TO</span>

                    <h3>
                      {booking?.to ||
                        booking?.bus?.to ||
                        "N/A"}
                    </h3>
                  </div>
                </div>

                {/* BOOKING DETAILS */}
                <div className="my-booking-details">

                  <div>
                    <span>BUS</span>

                    <strong>
                      {booking?.bus?.busName ||
                        booking?.busName ||
                        booking?.bus?.operatorName ||
                        "Bus details unavailable"}
                    </strong>
                  </div>

                  <div>
                    <span>JOURNEY DATE</span>

                    <strong>
                      {formatDate(booking?.journeyDate)}
                    </strong>
                  </div>

                  <div>
                    <span>SEATS</span>

                    <strong>
                      {Array.isArray(booking?.seats)
                        ? booking.seats.join(", ")
                        : "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span>PASSENGERS</span>

                    <strong>
                      {booking?.passengers?.length || 0}
                    </strong>
                  </div>

                  <div>
                    <span>PAYMENT</span>

                    <strong>
                      {booking?.paymentStatus || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span>TOTAL AMOUNT</span>

                    <strong className="my-booking-price">
                      ₹
                      {Number(
                        booking?.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="my-booking-actions">

                  <button
                    type="button"
                    className="my-booking-view-ticket"
                    onClick={() => openTicket(booking)}
                  >
                    <Ticket size={17} />
                    View Ticket
                  </button>

                  {!validTicket && (
                    <span className="my-booking-ticket-note">
                      Ticket available after successful payment.
                    </span>
                  )}

                </div>

              </article>
            );
          })}
        </div>
      </div>

      {/* DIGITAL TICKET MODAL */}
      {selectedBooking && (
        <div
          className="luxride-ticket-overlay"
          onClick={closeTicket}
        >
          <div
            className="luxride-ticket-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="luxride-ticket-modal-header">
              <div>
                <span>LUXRIDE DIGITAL TICKET</span>
                <h2>Your Journey Ticket</h2>
              </div>

              <button
                type="button"
                className="luxride-ticket-close"
                onClick={closeTicket}
                aria-label="Close ticket"
              >
                <X size={21} />
              </button>
            </div>

            {/* PRINTABLE TICKET */}
            <div className="luxride-ticket" id="luxride-print-ticket">

              <div className="luxride-ticket-header">
                <div>
                  <span className="luxride-ticket-brand">
                    LUXRIDE
                  </span>

                  <p>TRAVEL IN COMFORT</p>
                </div>

                <div className="luxride-ticket-icon">
                  <Ticket size={30} />
                </div>
              </div>

              <div className="luxride-ticket-reference">
                <span>BOOKING REFERENCE</span>

                <strong>
                  {selectedBooking?.bookingReference || "N/A"}
                </strong>

                <span
                  className={
                    isTicketValid(selectedBooking)
                      ? "luxride-ticket-valid"
                      : "luxride-ticket-invalid"
                  }
                >
                  {isTicketValid(selectedBooking)
                    ? "CONFIRMED TICKET"
                    : "NOT VALID FOR TRAVEL"}
                </span>
              </div>

              {/* JOURNEY */}
              <div className="luxride-ticket-route">
                <div>
                  <span>FROM</span>

                  <h2>
                    {selectedBooking?.from ||
                      selectedBooking?.bus?.from ||
                      "N/A"}
                  </h2>
                </div>

                <div className="luxride-ticket-route-arrow">
                  →
                </div>

                <div>
                  <span>TO</span>

                  <h2>
                    {selectedBooking?.to ||
                      selectedBooking?.bus?.to ||
                      "N/A"}
                  </h2>
                </div>
              </div>

              {/* JOURNEY INFORMATION */}
              <div className="luxride-ticket-grid">

                <div>
                  <CalendarDays size={17} />

                  <span>JOURNEY DATE</span>

                  <strong>
                    {formatDate(selectedBooking?.journeyDate)}
                  </strong>
                </div>

                <div>
                  <BusFront size={17} />

                  <span>BUS</span>

                  <strong>
                    {selectedBooking?.bus?.busName ||
                      selectedBooking?.busName ||
                      selectedBooking?.bus?.operatorName ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <Clock size={17} />

                  <span>DEPARTURE</span>

                  <strong>
                    {formatTime(
                      selectedBooking?.bus?.departureTime ||
                      selectedBooking?.departureTime
                    )}
                  </strong>
                </div>

                <div>
                  <MapPin size={17} />

                  <span>ARRIVAL</span>

                  <strong>
                    {formatTime(
                      selectedBooking?.bus?.arrivalTime ||
                      selectedBooking?.arrivalTime
                    )}
                  </strong>
                </div>

                <div>
                  <Ticket size={17} />

                  <span>SEAT NUMBERS</span>

                  <strong>
                    {Array.isArray(selectedBooking?.seats)
                      ? selectedBooking.seats.join(", ")
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <CreditCard size={17} />

                  <span>PAYMENT STATUS</span>

                  <strong>
                    {selectedBooking?.paymentStatus || "Pending"}
                  </strong>
                </div>

              </div>

              {/* PASSENGERS */}
              <div className="luxride-ticket-passengers">
                <h3>
                  <UserRound size={18} />
                  Passenger Details
                </h3>

                {Array.isArray(selectedBooking?.passengers) &&
                selectedBooking.passengers.length > 0 ? (
                  selectedBooking.passengers.map(
                    (passenger, index) => (
                      <div
                        className="luxride-ticket-passenger"
                        key={index}
                      >
                        <div>
                          <strong>
                            {passenger?.name || `Passenger ${index + 1}`}
                          </strong>

                          <span>
                            {passenger?.age
                              ? `${passenger.age} years`
                              : "Age N/A"}
                            {passenger?.gender
                              ? ` • ${passenger.gender}`
                              : ""}
                          </span>
                        </div>

                        <strong>
                          {passenger?.seatNumber ||
                            selectedBooking?.seats?.[index] ||
                            "N/A"}
                        </strong>
                      </div>
                    )
                  )
                ) : (
                  <p>Passenger details unavailable.</p>
                )}
              </div>

              {/* TOTAL */}
              <div className="luxride-ticket-total">
                <span>TOTAL PAID</span>

                <strong>
                  ₹
                  {Number(
                    selectedBooking?.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              {/* FOOTER */}
              <div className="luxride-ticket-footer">
                <ShieldCheck size={20} />

                <div>
                  <strong>
                    Travel with confidence
                  </strong>

                  <p>
                    Please carry a valid identity document
                    during your journey.
                  </p>
                </div>
              </div>

            </div>

            {/* MODAL ACTIONS */}
            <div className="luxride-ticket-actions">

              <button
                type="button"
                className="luxride-ticket-cancel"
                onClick={closeTicket}
              >
                Close
              </button>

              <button
                type="button"
                className="luxride-ticket-download"
                onClick={downloadTicket}
                disabled={!isTicketValid(selectedBooking)}
              >
                <Download size={17} />
                Download PDF
              </button>

            </div>

            {!isTicketValid(selectedBooking) && (
              <p className="luxride-ticket-warning">
                Your ticket cannot be downloaded until the
                booking is confirmed and payment is successful.
              </p>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
