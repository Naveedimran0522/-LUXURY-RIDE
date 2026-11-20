
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, LoaderCircle } from "lucide-react";
import "../styles/PaymentResult.css";

import { apiRequest } from "../services/api";

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function cancelReservation() {
      if (!bookingId) {
        setMessage("Payment was cancelled.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest("/payments/cancel", {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        });

        if (active) {
          setMessage(response.message || "Reservation cancelled.");
        }
      } catch (error) {
        if (active) {
          setMessage(error.message || "Unable to cancel reservation.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    cancelReservation();

    return () => {
      active = false;
    };
  }, [bookingId]);

  return (
    <main className="payment-result-page">
      {loading ? (
        <>
          <LoaderCircle className="payment-result-spinner" size={48} />
          <h2>Updating Reservation</h2>
        </>
      ) : (
        <>
          <XCircle size={54} color="#d64545" />
          <h1>Payment Cancelled</h1>
          <p>{message}</p>

          <button onClick={() => navigate("/buses")}>
            Search Buses Again
          </button>
        </>
      )}
    </main>
  );
}
