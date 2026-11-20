
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — COMPLETE SEAT SELECTION */

import React, { useMemo, useState, useEffect } from "react";
import { Armchair, Check, Info } from "lucide-react";
import "./SeatSelection.css";

export default function SeatSelection({
  busSeats = [],
  onSelectionChange,
  fare = 0,
}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatsPerRow = useMemo(() => {
    const hasFourSeats = busSeats.some(
      (seat) => Number(seat.rowCapacity) === 4
    );

    return hasFourSeats ? 4 : 3;
  }, [busSeats]);

  useEffect(() => {
    setSelectedSeats([]);
    onSelectionChange?.({ seats: [], total: 0 });
  }, [busSeats]);

  const seatFare = (seat) => Number(seat.price ?? fare ?? 0);

  const notifyParent = (nextSeats) => {
    const total = nextSeats.reduce(
      (sum, seat) => sum + seatFare(seat),
      0
    );

    setSelectedSeats(nextSeats);
    onSelectionChange?.({
      seats: nextSeats,
      total,
    });
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;

    const alreadySelected = selectedSeats.some(
      (item) => item.seatNumber === seat.seatNumber
    );

    if (alreadySelected) {
      notifyParent(
        selectedSeats.filter(
          (item) => item.seatNumber !== seat.seatNumber
        )
      );
      return;
    }

    if (selectedSeats.length >= 6) {
      alert("You can select a maximum of 6 seats.");
      return;
    }

    notifyParent([...selectedSeats, seat]);
  };

  const rows = useMemo(() => {
    const result = [];

    for (let i = 0; i < busSeats.length; i += seatsPerRow) {
      result.push(busSeats.slice(i, i + seatsPerRow));
    }

    return result;
  }, [busSeats, seatsPerRow]);

  if (!busSeats.length) {
    return (
      <div className="seat-empty">
        <Info size={22} />
        <p>Seat information is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="lux-seat-wrapper">
      <div className="seat-top-info">
        <div>
          <span className="seat-small-label">LUXRIDE</span>
          <h3>Choose Your Seats</h3>
          <p>Select up to 6 seats for your journey.</p>
        </div>

        <div className="seat-selected-count">
          {selectedSeats.length}/6
          <span>Selected</span>
        </div>
      </div>

      <div className="seat-legend">
        <div>
          <span className="legend-seat available-legend" />
          Available
        </div>
        <div>
          <span className="legend-seat selected-legend" />
          Selected
        </div>
        <div>
          <span className="legend-seat booked-legend" />
          Unavailable
        </div>
      </div>

      <div className="bus-seat-board">
        <div className="driver-area">
          <span>FRONT</span>
          <div className="driver-icon">
            <Armchair size={23} />
          </div>
        </div>

        <div className={`seat-grid ${seatsPerRow === 4 ? "four-seat-row" : "three-seat-row"}`}>
          {rows.map((row, rowIndex) => (
            <div className="seat-row" key={`row-${rowIndex}`}>
              {row.map((seat, seatIndex) => {
                const isSelected = selectedSeats.some(
                  (item) => item.seatNumber === seat.seatNumber
                );

                const isAvailable = seat.status === "available";

                return (
                  <React.Fragment key={seat.seatNumber}>
                    {seatsPerRow === 4 && seatIndex === 2 && (
                      <div className="seat-aisle" />
                    )}

                    {seatsPerRow === 3 && seatIndex === 2 && (
                      <div className="seat-aisle" />
                    )}

                    <button
                      type="button"
                      className={[
                        "lux-seat",
                        isSelected ? "seat-selected" : "",
                        !isAvailable ? "seat-booked" : "",
                      ].join(" ")}
                      disabled={!isAvailable}
                      onClick={() => toggleSeat(seat)}
                      title={`${seat.seatNumber} - ${
                        isAvailable ? "Available" : "Unavailable"
                      }`}
                    >
                      {isSelected ? (
                        <Check size={17} />
                      ) : (
                        <Armchair size={18} />
                      )}

                      <span>{seat.seatNumber}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        <div className="bus-back-area">BACK OF THE BUS</div>
      </div>

      <div className="seat-selection-bottom">
        <div className="seat-selection-price">
          <span>Selected seats</span>
          <strong>
            {selectedSeats.length
              ? selectedSeats.map((seat) => seat.seatNumber).join(", ")
              : "None"}
          </strong>
        </div>

        <div className="seat-selection-price">
          <span>Total fare</span>
          <strong>
            ₹
            {selectedSeats
              .reduce((sum, seat) => sum + seatFare(seat), 0)
              .toLocaleString("en-IN")}
          </strong>
        </div>
      </div>
    </div>
  );
}
