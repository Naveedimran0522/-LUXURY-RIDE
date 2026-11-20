
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PAYMENT SUCCESS
STRIPE PAYMENT VERIFICATION
*/

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, LoaderCircle } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    let active = true;

    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const token = sessionStorage.getItem("luxride_token");

        if (!sessionId) {
          throw new Error("Stripe session ID is missing.");
        }

        if (!token) {
          throw new Error("Please login again to verify your booking.");
        }

        const response = await fetch(`${API_URL}/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Payment verification failed.");
        }

        if (!active) return;

        setStatus("success");
        setMessage(
          data.message || "Your payment was successful. Booking confirmed!"
        );
      } catch (error) {
        if (!active) return;

        setStatus("error");
        setMessage(error.message || "Unable to verify payment.");
      }
    };

    verifyPayment();

    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f2] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        {status === "loading" && (
          <>
            <LoaderCircle className="mx-auto mb-5 h-16 w-16 animate-spin text-[#b8955b]" />
            <h1 className="text-2xl font-bold text-[#263c30]">
              Verifying Payment
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-green-600" />
            <h1 className="text-2xl font-bold text-[#263c30]">
              Payment Successful!
            </h1>

            <button
              onClick={() => navigate("/bookings")}
              className="mt-7 w-full rounded-xl bg-[#263c30] px-5 py-3 font-semibold text-white"
            >
              View My Bookings
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto mb-5 h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-bold text-[#263c30]">
              Verification Failed
            </h1>

            <button
              onClick={() => navigate("/bookings")}
              className="mt-7 w-full rounded-xl bg-[#263c30] px-5 py-3 font-semibold text-white"
            >
              Go to My Bookings
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}
