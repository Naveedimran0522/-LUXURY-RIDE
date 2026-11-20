
import { useNavigate } from "react-router-dom";
import {
  BusFront,
  Clock3,
  Armchair,
  Snowflake,
  ArrowRight,
  Wifi,
} from "lucide-react";

export default function BusCard({ bus }) {
  const navigate = useNavigate();

  const amenities = Array.isArray(bus.amenities)
    ? bus.amenities
    : [];

  // Support both old and current API field names
  const availableSeats = Array.isArray(bus.availableSeatNumbers)
    ? bus.availableSeatNumbers.length
    : Number(bus.availableSeats ?? 0);

  const price = Number(bus.fare ?? bus.price ?? 0);

  const isSoldOut = availableSeats <= 0;

  return (
    <article className="bus-card">
      <div className="bus-card-top">
        <div>
          <p className="bus-operator">
            {bus.operatorName}
          </p>

          <h2>{bus.busName}</h2>

          <span className="bus-type">
            <BusFront size={14} />
            {bus.busType}
          </span>
        </div>

        <div className="bus-price">
          <small>Starting from</small>

          <strong>
            ₹{price.toLocaleString("en-IN")}
          </strong>

          <small>per passenger</small>
        </div>
      </div>

      <div className="bus-timing">
        <div>
          <strong>{bus.departureTime}</strong>
          <span>{bus.from}</span>
        </div>

        <div className="bus-duration">
          <Clock3 size={15} />
          <span>{bus.duration}</span>
          <div />
        </div>

        <div>
          <strong>{bus.arrivalTime}</strong>
          <span>{bus.to}</span>
        </div>
      </div>

      <div className="bus-card-bottom">
        <div className="bus-amenities">
          {amenities.slice(0, 3).map((item, index) => {
            const amenity = String(item);
            const lower = amenity.toLowerCase();

            return (
              <span key={`${amenity}-${index}`}>
                {lower.includes("wifi") ? (
                  <Wifi size={14} />
                ) : lower.includes("ac") ? (
                  <Snowflake size={14} />
                ) : (
                  <Armchair size={14} />
                )}

                {amenity}
              </span>
            );
          })}
        </div>

        <div className="bus-availability">
          {isSoldOut ? (
            <span className="sold-out">
              Sold Out
            </span>
          ) : (
            <span className="seats-available">
              {availableSeats} seats available
            </span>
          )}
        </div>
      </div>

      <button
        className="bus-select-button"
        disabled={isSoldOut}
        onClick={() => navigate(`/bus/${bus._id}`)}
      >
        {isSoldOut ? "SOLD OUT" : "VIEW DETAILS"}
        <ArrowRight size={17} />
      </button>
    </article>
  );
}
