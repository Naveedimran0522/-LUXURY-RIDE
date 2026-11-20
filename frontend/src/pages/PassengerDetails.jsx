
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PASSENGER DETAILS
DIRECT STRIPE CHECKOUT
*/

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserRound,
  ShieldCheck,
  LoaderCircle,
  CreditCard,
} from "lucide-react";

import { apiRequest } from "../services/api";
import "../styles/PassengerDetails.css";

export default function PassengerDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // Booking data received from seat selection page
  const bookingData = location.state || {};

  // Normalize selected seats
  const seats = Array.isArray(bookingData.seats)
    ? bookingData.seats.map((seat) => String(seat).trim())
    : [];

  // Component states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Passenger information
  const [passengers, setPassengers] = useState(() =>
    seats.map(() => ({
      name: "",
      age: "",
      gender: "Male",
    }))
  );

  // =====================================
  // VALIDATE BOOKING DATA
  // =====================================

  const validBooking =
    Boolean(bookingData.busId) &&
    seats.length >= 1 &&
    seats.length <= 6 &&
    seats.every(Boolean) &&
    new Set(seats).size === seats.length;

  // =====================================
  // UPDATE PASSENGER
  // =====================================

  const updatePassenger = (index, field, value) => {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger
      )
    );

    setError("");
  };

  // =====================================
  // VALIDATE PASSENGERS
  // =====================================

  const validatePassengers = () => {
    if (passengers.length !== seats.length) {
      return "Passenger count must match selected seats.";
    }

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      const name = passenger.name.trim();
      const age = Number(passenger.age);

      if (!name || name.length > 100) {
        return `Please enter a valid name for Passenger ${i + 1}.`;
      }

      if (
        passenger.age === "" ||
        !Number.isInteger(age) ||
        age < 1 ||
        age > 120
      ) {
        return `Please enter a valid age for Passenger ${i + 1}.`;
      }

      if (!["Male", "Female", "Other"].includes(passenger.gender)) {
        return `Please select a valid gender for Passenger ${i + 1}.`;
      }
    }

    return "";
  };

  // =====================================
  // CREATE PENDING BOOKING + STRIPE SESSION
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    // Validate bus and selected seats
    if (!validBooking) {
      setError(
        "Booking details are invalid. Please select your bus and seats again."
      );
      return;
    }

    // Validate passenger information
    const validationError = validatePassengers();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // Prepare passenger data
      const passengerDetails = passengers.map((passenger) => ({
        name: passenger.name.trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
      }));

      /*
        IMPORTANT:

        One API request only.

        Backend will:
        1. Validate the bus.
        2. Validate selected seats.
        3. Reserve selected seats.
        4. Create pending booking.
        5. Create Stripe Checkout Session.
        6. Return checkoutUrl.
      */

      const paymentResponse = await apiRequest(
        "/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            busId: bookingData.busId,
            seats,
            passengers: passengerDetails,
          }),
        }
      );

      // Validate backend response
      if (
        !paymentResponse ||
        paymentResponse.success !== true ||
        !paymentResponse.checkoutUrl
      ) {
        throw new Error(
          paymentResponse?.message ||
            "Unable to create Stripe checkout session."
        );
      }

      // Validate Stripe URL before redirect
      let checkoutUrl;

      try {
        checkoutUrl = new URL(paymentResponse.checkoutUrl);
      } catch {
        throw new Error("Invalid Stripe checkout URL received.");
      }

      if (
        checkoutUrl.protocol !== "https:" ||
        !(
          checkoutUrl.hostname === "checkout.stripe.com" ||
          checkoutUrl.hostname.endsWith(".stripe.com")
        )
      ) {
        throw new Error("Invalid Stripe checkout URL received.");
      }

      // Redirect to Stripe Checkout
      window.location.assign(checkoutUrl.toString());

    } catch (err) {
      console.error("Passenger booking/payment error:", err);

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // =====================================
  // INVALID BOOKING SCREEN
  // =====================================

  if (!validBooking) {
    return (
      <main className="passenger-page">
        <div className="passenger-error">
          <h2>Booking Details Not Found</h2>

          <p>
            Please select your bus and seats again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/search")}
          >
            Browse Buses
          </button>
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <main className="passenger-page">
      <div className="passenger-container">

        {/* HEADER */}

        <header className="passenger-header">
          <button
            type="button"
            className="passenger-back"
            onClick={() => navigate(-1)}
            disabled={loading}
            aria-label="Go back"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1>Passenger Details</h1>

            <p>
              Enter details for your selected seats
            </p>
          </div>
        </header>

        {/* TRIP DETAILS */}

        <section className="passenger-trip-card">
          <div>
            <span>BUS</span>

            <h2>
              {bookingData.busName || "Selected Bus"}
            </h2>
          </div>

          <div className="passenger-trip-route">
            <strong>
              {bookingData.from || "From"}
            </strong>

            <span>→</span>

            <strong>
              {bookingData.to || "To"}
            </strong>
          </div>

          <p>
            Departure:{" "}
            {bookingData.departureTime || "Not available"}
          </p>

          {bookingData.travelDate && (
            <p>
              Journey Date:{" "}
              {bookingData.travelDate}
            </p>
          )}

          <div className="passenger-selected-seats">
            <span>Selected Seats</span>

            <strong>
              {seats.join(", ")}
            </strong>
          </div>
        </section>

        {/* PASSENGER FORM */}

        <form
          className="passenger-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="passenger-form-heading">
            <UserRound size={21} />

            <div>
              <h2>Passenger Information</h2>

              <p>
                Enter one passenger for each selected seat.
              </p>
            </div>
          </div>

          {/* PASSENGER CARDS */}

          {passengers.map((passenger, index) => (
            <section
              className="passenger-input-card"
              key={seats[index]}
            >
              <div className="passenger-card-heading">
                <h3>
                  Passenger {index + 1}
                </h3>

                <span>
                  Seat {seats[index]}
                </span>
              </div>

              {/* NAME */}

              <div className="passenger-field">
                <label htmlFor={`name-${index}`}>
                  Full Name
                </label>

                <input
                  id={`name-${index}`}
                  type="text"
                  placeholder="Enter passenger full name"
                  value={passenger.name}
                  onChange={(event) =>
                    updatePassenger(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                  maxLength={100}
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </div>

              {/* AGE + GENDER */}

              <div className="passenger-fields-row">
                <div className="passenger-field">
                  <label htmlFor={`age-${index}`}>
                    Age
                  </label>

                  <input
                    id={`age-${index}`}
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    step="1"
                    value={passenger.age}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "age",
                        event.target.value
                      )
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div className="passenger-field">
                  <label htmlFor={`gender-${index}`}>
                    Gender
                  </label>

                  <select
                    id={`gender-${index}`}
                    value={passenger.gender}
                    onChange={(event) =>
                      updatePassenger(
                        index,
                        "gender",
                        event.target.value
                      )
                    }
                    required
                    disabled={loading}
                  >
                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </section>
          ))}

          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="passenger-error-message"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* SECURITY INFORMATION */}

          <div className="passenger-submit-info">
            <ShieldCheck size={18} />

            <span>
              Your selected seats will be reserved after the
              server creates your pending booking. Complete
              your payment before the reservation expires.
            </span>
          </div>

          {/* PAYMENT BUTTON */}

          <button
            type="submit"
            className="reserve-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  className="passenger-spinner"
                  size={19}
                />

                Connecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard size={19} />

                Reserve & Continue to Payment
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
