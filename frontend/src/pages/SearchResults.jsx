
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — SEARCH RESULTS
SINGLE DATE + DATE RANGE SUPPORT
*/

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  SlidersHorizontal,
  BusFront,
  SearchX,
} from "lucide-react";

import BusCard from "../components/buses/BusCard";
import { searchBuses } from "../services/busService";

export default function SearchResults() {
  const [params] = useSearchParams();

  const from = (params.get("from") || "").trim();
  const to = (params.get("to") || "").trim();

  // Single date support
  const singleDate = (params.get("date") || "").trim();

  // Date range support with backward compatibility
  const dateFrom = (
    params.get("dateFrom") || singleDate
  ).trim();

  const dateTo = (
    params.get("dateTo") || singleDate
  ).trim();

  const passengerValue = Number(
    params.get("passengers") || 1
  );

  const passengers =
    Number.isInteger(passengerValue) && passengerValue > 0
      ? passengerValue
      : 1;

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busType, setBusType] = useState("All");
  const [sort, setSort] = useState("departure");

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (value) => {
    if (!value) return "";

    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
  };

  const dateLabel =
    dateFrom === dateTo
      ? formatDate(dateFrom)
      : `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;

  // ==========================================
  // LOAD BUSES
  // ==========================================

  useEffect(() => {
    let active = true;

    const loadBuses = async () => {
      if (!from || !to || !dateFrom || !dateTo) {
        setBuses([]);
        setError(
          "Search details are missing. Please search again."
        );
        setLoading(false);
        return;
      }

      if (from.toLowerCase() === to.toLowerCase()) {
        setBuses([]);
        setError(
          "Source and destination cannot be the same."
        );
        setLoading(false);
        return;
      }

      if (dateFrom > dateTo) {
        setBuses([]);
        setError(
          "End date cannot be earlier than start date."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const results = await searchBuses({
          from,
          to,
          dateFrom,
          dateTo,
        });

        if (!active) return;

        setBuses(
          Array.isArray(results) ? results : []
        );
      } catch (err) {
        if (!active) return;

        console.error("Bus search error:", err);

        setBuses([]);

        setError(
          err?.message ||
            "Unable to load buses. Please try again."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBuses();

    return () => {
      active = false;
    };
  }, [from, to, dateFrom, dateTo]);

  // ==========================================
  // FILTER AND SORT
  // ==========================================

  const filteredBuses = useMemo(() => {
    let result = [...buses];

    // Bus type filter
    if (busType !== "All") {
      result = result.filter(
        (bus) => bus.busType === busType
      );
    }

    // Lowest price
    if (sort === "price") {
      result.sort((a, b) => {
        const fareA = Number(
          a.fare ?? a.price ?? 0
        );

        const fareB = Number(
          b.fare ?? b.price ?? 0
        );

        return fareA - fareB;
      });
    } else {
      // Journey date, then departure time
      result.sort((a, b) => {
        const dateCompare = String(
          a.travelDate || ""
        ).localeCompare(
          String(b.travelDate || "")
        );

        if (dateCompare !== 0) {
          return dateCompare;
        }

        return String(
          a.departureTime || ""
        ).localeCompare(
          String(b.departureTime || "")
        );
      });
    }

    return result;
  }, [buses, busType, sort]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="search-results-page">
      <div className="results-container">

        {/* BACK BUTTON */}

        <Link to="/" className="results-back">
          <ArrowLeft size={17} />
          Back to home
        </Link>

        {/* SEARCH HEADING */}

        <section className="results-heading">
          <p className="results-eyebrow">
            YOUR NEXT JOURNEY
          </p>

          <h1>Find your perfect ride.</h1>

          <div className="route-summary">
            <strong>{from || "From"}</strong>
            <span>→</span>
            <strong>{to || "To"}</strong>
          </div>

          <p>
            {dateLabel || "Select travel date"}
            <span> · </span>
            {passengers} passenger
            {passengers === 1 ? "" : "s"}
          </p>
        </section>

        {/* RESULTS TOOLBAR */}

        <section className="results-toolbar">

          <div className="results-count">
            <BusFront size={19} />

            {loading
              ? "Searching buses..."
              : `${filteredBuses.length} buses found`}
          </div>

          <div className="results-filters">

            {/* BUS TYPE FILTER */}

            <label>
              <SlidersHorizontal size={15} />

              <select
                value={busType}
                onChange={(e) =>
                  setBusType(e.target.value)
                }
              >
                <option value="All">
                  All bus types
                </option>

                <option value="AC Sleeper (2+1)">
                  AC Sleeper
                </option>

                <option value="AC Semi-Sleeper (2+2)">
                  AC Semi-Sleeper
                </option>

                <option value="Non-AC Sleeper">
                  Non-AC Sleeper
                </option>

                <option value="AC Seater">
                  AC Seater
                </option>

                <option value="Volvo Multi-Axle">
                  Volvo Multi-Axle
                </option>
              </select>
            </label>

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >
              <option value="departure">
                Journey date & departure
              </option>

              <option value="price">
                Lowest price
              </option>
            </select>

          </div>
        </section>

        {/* LOADING */}

        {loading && (
          <div className="results-message">
            <div className="auth-spinner" />
            <p>Finding journeys for you...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="results-message">
            <SearchX size={38} />

            <h2>We couldn't complete your search</h2>

            <p>{error}</p>

            <Link
              to="/"
              className="results-home-button"
            >
              Search again
            </Link>
          </div>
        )}

        {/* NO BUSES */}

        {!loading &&
          !error &&
          filteredBuses.length === 0 && (
            <div className="results-message">
              <SearchX size={38} />

              <h2>No buses found</h2>

              <p>
                No matching buses are currently listed
                for this route and selected date.
                Try another date or route.
              </p>

              <Link
                to="/"
                className="results-home-button"
              >
                Search another journey
              </Link>
            </div>
          )}

        {/* BUS LIST */}

        {!loading &&
          !error &&
          filteredBuses.length > 0 && (
            <div className="bus-list">
              {filteredBuses.map((bus) => (
                <BusCard
                  key={bus._id}
                  bus={bus}
                  passengers={passengers}
                />
              ))}
            </div>
          )}

      </div>
    </main>
  );
}
