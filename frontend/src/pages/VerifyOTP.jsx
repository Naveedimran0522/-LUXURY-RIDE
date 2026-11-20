
/*
Bismillah-ir-Rahman-ir-Raheem ❤️

LUXRIDE — PREMIUM OTP VERIFICATION
LOGIN / REGISTER → HOME PAGE
*/

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ArrowLeft, ShieldCheck } from "lucide-react";

import { requestOTP, verifyOTP } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, name, mode } = location.state || {};

  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // CHECK OTP SESSION
  useEffect(() => {
    if (!email || !["login", "register"].includes(mode)) {
      navigate("/login", { replace: true });
    }
  }, [email, mode, navigate]);

  // OTP COUNTDOWN
  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  // VERIFY OTP
  const handleVerify = async (event) => {
    event.preventDefault();

    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter your 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOTP({
        email,
        otp,
        mode,
      });

      if (!data?.token || !data?.user) {
        throw new Error(
          "Token or user missing from server response."
        );
      }

      // SAVE AUTHENTICATION
      login(data.user, data.token);

      // BOTH LOGIN AND REGISTER → HOME
      navigate("/", {
        replace: true,
      });

    } catch (err) {
      setError(
        err?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    if (loading || seconds > 0) return;

    setLoading(true);
    setError("");

    try {
      await requestOTP({
        email,
        name,
        mode,
      });

      setOtp("");
      setSeconds(60);

      inputRef.current?.focus();

    } catch (err) {
      setError(
        err?.message || "Unable to resend OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card otp-card">

        <button
          type="button"
          className="auth-back"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="auth-brand">
          LUX<span>RIDE</span>
        </div>

        <div className="auth-icon">
          <ShieldCheck size={30} />
        </div>

        <p className="auth-eyebrow">
          SECURE VERIFICATION
        </p>

        <h1>Verify your email</h1>

        <p className="auth-description">
          We've sent a six-digit verification code to
          <strong> {email}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <label className="auth-label">
            ENTER 6-DIGIT CODE
          </label>

          <input
            ref={inputRef}
            className="otp-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(event) => {
              setOtp(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              );

              setError("");
            }}
            required
          />

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || otp.length !== 6}
          >
            {loading
              ? "VERIFYING..."
              : "VERIFY & CONTINUE"}
          </button>

        </form>

        <div className="resend-area">
          {seconds > 0 ? (
            <p>
              Resend code in{" "}
              <strong>
                00:{String(seconds).padStart(2, "0")}
              </strong>
            </p>
          ) : (
            <button
              type="button"
              className="auth-link"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "SENDING..." : "Resend OTP"}
            </button>
          )}
        </div>

      </section>
    </main>
  );
}
