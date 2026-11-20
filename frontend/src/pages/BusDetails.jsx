
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — COMPLETE BUS DETAILS PAGE */

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BusFront,
  Clock3,
  MapPin,
  ShieldCheck,
  Wifi,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { apiRequest } from "../services/api";
import SeatSelection from "../components/booking/SeatSelection";

import "./BusDetails.css";

export default function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [selection, setSelection] = useState({
    seats: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH BUS DETAILS
  useEffect(() => {
    let isMounted = true;

    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest(`/buses/${id}`);

        const busData =
          response?.bus ||
          response?.data?.bus ||
          response?.data ||
          response;

        if (!busData?._id) {
          throw new Error("Bus details not found.");
        }

        if (isMounted) {
          setBus(busData);
          setSelection({ seats: [], total: 0 });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.message ||
              "Unable to load bus details. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchBusDetails();
    } else {
      setError("Invalid bus ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // CREATE SEAT DATA FROM BACKEND
  const busSeats = useMemo(() => {
    if (!bus) return [];

    const fare = Number(bus.fare ?? bus.price ?? 0);
    const rowCapacity = String(bus.busType || "").includes("(2+2)")
      ? 4
      : 3;

    // If backend provides seat objects
    if (Array.isArray(bus.seats) && bus.seats.length > 0) {
      return bus.seats.map((seat) => ({
        ...seat,
        seatNumber: String(seat.seatNumber),
        price: Number(seat.price ?? fare),
        status:
          seat.status === "available"
            ? "available"
            : "unavailable",
        rowCapacity,
      }));
    }

    // Current database format:
    // availableSeatNumbers: ["A3", "A4", ...]
    const availableNumbers = Array.isArray(bus.availableSeatNumbers)
      ? bus.availableSeatNumbers.map((seat) =>
          String(seat).toUpperCase()
        )
      : [];

    if (!availableNumbers.length) return [];

    const totalSeats = Number(
      bus.totalSeats || availableNumbers.length
    );

    const prefix = availableNumbers[0].replace(/[0-9]/g, "");

    const availableSet = new Set(availableNumbers);

    return Array.from({ length: totalSeats }, (_, index) => {
      const seatNumber = `${prefix}${index + 1}`;

      return {
        seatNumber,
        seatType: String(bus.busType || "")
          .toLowerCase()
          .includes("sleeper")
          ? "sleeper"
          : "seater",
        deck: "lower",
        price: fare,
        status: availableSet.has(seatNumber.toUpperCase())
          ? "available"
          : "unavailable",
        rowCapacity,
      };
    });
  }, [bus]);

  // HANDLE SELECTION
  const handleSeatSelection = useCallback((nextSelection) => {
    setSelection(nextSelection);
  }, []);

  // LOADING
  if (loading) {
    return (
      <div className="bus-details-loading">
        <LoaderCircle className="loading-spinner" size={42} />
        <p>Loading bus details...</p>
      </div>
    );
  }

  // ERROR
  if (error || !bus) {
    return (
      <div className="bus-details-error">
        <AlertCircle size={42} />
        <h2>Unable to Load Bus</h2>
        <p>{error || "Bus details not found."}</p>

        <button
          type="button"
          onClick={() => navigate("/buses")}
        >
          Browse Buses
        </button>
      </div>
    );
  }

  const amenities = Array.isArray(bus.amenities)
    ? bus.amenities
    : [];

  const travelDate = bus.travelDate
    ? new Date(bus.travelDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const busFare = Number(bus.fare ?? bus.price ?? 0);

  const handleContinue = () => {
    if (!selection.seats.length) return;

    navigate("/passenger-details", {
      state: {
        busId: bus._id,
        busName: bus.busName,
        operatorName: bus.operatorName,
        busType: bus.busType,
        from: bus.from,
        to: bus.to,
        travelDate: bus.travelDate,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        seats: selection.seats.map((seat) => seat.seatNumber),
        totalSeats: selection.seats.length,
        totalFare: selection.total,
      },
    });
  };

  return (
    <main className="bus-details-page">
      {/* HEADER */}
      <header className="bus-details-header">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Bus Details</h1>
          <p>Select your preferred seats</p>
        </div>
      </header>

      <div className="bus-details-container">
        {/* BUS INFORMATION */}
        <section className="bus-info-card">
          <div className="bus-info-top">
            <div className="bus-icon-box">
              <BusFront size={30} />
            </div>

            <div className="bus-main-info">
              <h2>{bus.operatorName || "Bus Operator"}</h2>
              <p>{bus.busName || "Bus Service"}</p>
            </div>

            <span className="bus-type-badge">
              {bus.busType || "Bus"}
            </span>
          </div>

          <div className="bus-route">
            <div className="route-location">
              <MapPin size={19} />
              <div>
                <span>FROM</span>
                <h3>{bus.from}</h3>
              </div>
            </div>

            <div className="route-line">
              <span />
              <span />
              <span />
            </div>

            <div className="route-location">
              <MapPin size={19} />
              <div>
                <span>TO</span>
                <h3>{bus.to}</h3>
              </div>
            </div>
          </div>

          <div className="bus-schedule">
            <div className="schedule-item">
              <Clock3 size={19} />
              <div>
                <span>Departure</span>
                <strong>{bus.departureTime || "N/A"}</strong>
              </div>
            </div>

            <div className="schedule-item">
              <Clock3 size={19} />
              <div>
                <span>Arrival</span>
                <strong>{bus.arrivalTime || "N/A"}</strong>
              </div>
            </div>

            <div className="schedule-item">
              <ShieldCheck size={19} />
              <div>
                <span>Travel Date</span>
                <strong>{travelDate}</strong>
              </div>
            </div>
          </div>

          {bus.duration && (
            <div className="bus-duration">
              <Clock3 size={16} />
              <span>Journey Duration: {bus.duration}</span>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="bus-amenities">
              <h3>Bus Amenities</h3>

              <div className="amenities-list">
                {amenities.map((amenity, index) => (
                  <span
                    className="amenity-item"
                    key={`${amenity}-${index}`}
                  >
                    <Wifi size={15} />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bus-detail-fare">
            <span>Starting fare per seat</span>
            <strong>
              ₹{busFare.toLocaleString("en-IN")}
            </strong>
          </div>
        </section>

        {/* SEAT SELECTION */}
        <section className="seat-selection-section">
          <div className="section-heading">
            <h2>Select Your Seats</h2>
            <p>Choose up to 6 seats for your journey.</p>
          </div>

          <SeatSelection
            busSeats={busSeats}
            onSelectionChange={handleSeatSelection}
          />
        </section>

        {/* BOOKING SUMMARY */}
        <section className="booking-summary-card">
          <div className="summary-heading">
            <h2>Booking Summary</h2>
          </div>

          <div className="summary-row">
            <span>Selected Seats</span>
            <strong>
              {selection.seats.length > 0
                ? selection.seats
                    .map((seat) => seat.seatNumber)
                    .join(", ")
                : "No seats selected"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Seats</span>
            <strong>{selection.seats.length}</strong>
          </div>

          <div className="summary-row">
            <span>Fare per seat</span>
            <strong>
              ₹{busFare.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="summary-total">
            <span>Total Fare</span>
            <strong>
              ₹{Number(selection.total || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            type="button"
            className="continue-booking-button"
            disabled={!selection.seats.length}
            onClick={handleContinue}
          >
            Continue to Passenger Details
          </button>

          <p className="booking-secure-note">
            <ShieldCheck size={15} />
            Secure booking experience
          </p>
        </section>
      </div>
    </main>
  );
}
