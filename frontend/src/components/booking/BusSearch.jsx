
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PREMIUM BUS SEARCH
DYNAMIC CITIES + UNLIMITED FUTURE DATES
SINGLE DATE + DATE RANGE
*/

import { useEffect, useState } from "react";

import {
  MapPin,
  CalendarDays,
  Users,
  ArrowLeftRight,
  Search,
  Minus,
  Plus,
  LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function BusSearch() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const [searchMode, setSearchMode] = useState("single");

  const [date, setDate] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [passengers, setPassengers] = useState(1);
  const [error, setError] = useState("");

  // LOCAL DATE — YYYY-MM-DD
  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalDate();

  // LOAD DYNAMIC CITIES
  useEffect(() => {
    let active = true;

    const loadCities = async () => {
      try {
        setLoadingCities(true);

        const response = await fetch(`${API_URL}/buses/cities`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load cities.");
        }

        if (active) {
          setCities(
            Array.isArray(data.cities) ? data.cities : []
          );
        }
      } catch (err) {
        console.error("LOAD CITIES ERROR:", err);

        if (active) {
          setCities([]);
        }
      } finally {
        if (active) {
          setLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      active = false;
    };
  }, []);

  // SWAP CITIES
  const swapCities = () => {
    setFrom(to);
    setTo(from);
    setError("");
  };

  // SEARCH MODE
  const handleModeChange = (mode) => {
    setSearchMode(mode);

    setDate("");
    setDateFrom("");
    setDateTo("");

    setError("");
  };

  // SEARCH BUSES
  const handleSearch = () => {
    const source = from.trim();
    const destination = to.trim();

    if (!source || !destination) {
      setError("Please enter your source and destination.");
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      setError("Source and destination cannot be the same.");
      return;
    }

    if (searchMode === "single") {
      if (!date) {
        setError("Please select your journey date.");
        return;
      }

      if (date < today) {
        setError("Past journey dates are not allowed.");
        return;
      }
    }

    if (searchMode === "range") {
      if (!dateFrom || !dateTo) {
        setError("Please select both start date and end date.");
        return;
      }

      if (dateFrom < today) {
        setError("Past journey dates are not allowed.");
        return;
      }

      if (dateTo < dateFrom) {
        setError("End date cannot be before start date.");
        return;
      }
    }

    const params = new URLSearchParams({
      from: source,
      to: destination,
      passengers: String(passengers),
    });

    if (searchMode === "single") {
      params.set("date", date);
    } else {
      params.set("dateFrom", dateFrom);
      params.set("dateTo", dateTo);
    }

    setError("");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section
      id="booking"
      className="relative z-20 -mt-14 md:-mt-20"
    >
      <div className="lux-container">
        <div className="bg-[#f8f5ed] text-[#17251c] shadow-2xl border-t-4 border-[#c5a66b] p-6 md:p-9">

          {/* HEADER */}

          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <p className="text-[#a17e43] text-xs tracking-[0.25em] mb-2">
                PLAN YOUR NEXT JOURNEY
              </p>

              <h2 className="playfair text-3xl md:text-4xl">
                Find Your Perfect Ride
              </h2>
            </div>

            <span className="text-xs text-gray-500">
              PREMIUM TRAVEL EXPERIENCE
            </span>
          </div>

          {/* SEARCH MODE */}

          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-3 tracking-wider">
              SELECT JOURNEY SEARCH TYPE
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleModeChange("single")}
                className={`px-5 py-3 text-sm font-semibold border transition ${
                  searchMode === "single"
                    ? "bg-[#17251c] text-[#c5a66b] border-[#17251c]"
                    : "bg-white text-[#17251c] border-[#e4dfd3] hover:border-[#a17e43]"
                }`}
              >
                <CalendarDays size={16} className="inline mr-2" />
                Single Date
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("range")}
                className={`px-5 py-3 text-sm font-semibold border transition ${
                  searchMode === "range"
                    ? "bg-[#17251c] text-[#c5a66b] border-[#17251c]"
                    : "bg-white text-[#17251c] border-[#e4dfd3] hover:border-[#a17e43]"
                }`}
              >
                <CalendarDays size={16} className="inline mr-2" />
                Date Range
              </button>
            </div>
          </div>

          {/* CITY SUGGESTIONS */}

          <datalist id="luxride-city-options">
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>

          {/* SEARCH FIELDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

            {/* FROM */}

            <div>
              <label className="text-xs text-gray-500 mb-2 block">
                FROM CITY / STATE
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-3 top-4 text-[#a17e43]"
                  size={18}
                />

                <input
                  type="text"
                  list="luxride-city-options"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter source city"
                  autoComplete="off"
                  className="w-full bg-white border border-[#e4dfd3] pl-10 pr-3 py-4 outline-none focus:border-[#a17e43]"
                />
              </div>
            </div>

            {/* TO */}

            <div>
              <label className="text-xs text-gray-500 mb-2 block">
                TO CITY / STATE
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-3 top-4 text-[#a17e43]"
                  size={18}
                />

                <input
                  type="text"
                  list="luxride-city-options"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter destination city"
                  autoComplete="off"
                  className="w-full bg-white border border-[#e4dfd3] pl-10 pr-3 py-4 outline-none focus:border-[#a17e43]"
                />
              </div>
            </div>

            {/* SINGLE DATE */}

            {searchMode === "single" && (
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  JOURNEY DATE
                </label>

                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-4 text-[#a17e43]"
                    size={18}
                  />

                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setError("");
                    }}
                    className="w-full bg-white border border-[#e4dfd3] pl-10 pr-2 py-4 outline-none focus:border-[#a17e43]"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Select any future journey date.
                </p>
              </div>
            )}

            {/* RANGE START */}

            {searchMode === "range" && (
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  START DATE
                </label>

                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-4 text-[#a17e43]"
                    size={18}
                  />

                  <input
                    type="date"
                    min={today}
                    value={dateFrom}
                    onChange={(e) => {
                      const value = e.target.value;

                      setDateFrom(value);

                      if (dateTo && value && dateTo < value) {
                        setDateTo("");
                      }

                      setError("");
                    }}
                    className="w-full bg-white border border-[#e4dfd3] pl-10 pr-2 py-4 outline-none focus:border-[#a17e43]"
                  />
                </div>
              </div>
            )}

            {/* RANGE END */}

            {searchMode === "range" && (
              <div>
                <label className="text-xs text-gray-500 mb-2 block">
                  END DATE
                </label>

                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-4 text-[#a17e43]"
                    size={18}
                  />

                  <input
                    type="date"
                    min={dateFrom || today}
                    value={dateTo}
                    disabled={!dateFrom}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setError("");
                    }}
                    className="w-full bg-white border border-[#e4dfd3] pl-10 pr-2 py-4 outline-none focus:border-[#a17e43] disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* PASSENGERS */}

            <div>
              <label className="text-xs text-gray-500 mb-2 block">
                PASSENGERS
              </label>

              <div className="flex items-center justify-between bg-white border border-[#e4dfd3] px-3 py-3.5">
                <Users size={19} className="text-[#a17e43]" />

                <button
                  type="button"
                  disabled={passengers <= 1}
                  onClick={() => setPassengers((p) => p - 1)}
                  className="p-1 disabled:opacity-30"
                  aria-label="Remove passenger"
                >
                  <Minus size={16} />
                </button>

                <span className="font-semibold">{passengers}</span>

                <button
                  type="button"
                  disabled={passengers >= 6}
                  onClick={() => setPassengers((p) => p + 1)}
                  className="p-1 disabled:opacity-30"
                  aria-label="Add passenger"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* CITY LOADING */}

          {loadingCities && (
            <p className="flex items-center gap-2 text-xs text-gray-500 mt-3">
              <LoaderCircle size={14} className="animate-spin" />
              Loading available cities...
            </p>
          )}

          {!loadingCities && cities.length === 0 && (
            <p className="text-xs text-gray-500 mt-3">
              No saved city suggestions yet. You can still type any city name.
            </p>
          )}

          {/* ACTIONS */}

          <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
            <button
              type="button"
              onClick={swapCities}
              className="flex items-center gap-2 text-sm text-[#806536] hover:text-black"
            >
              <ArrowLeftRight size={17} />
              Swap destinations
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="lux-button flex items-center justify-center gap-3 min-w-48"
            >
              <Search size={19} />
              Search Buses
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <p role="alert" className="text-red-600 text-sm mt-4">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
