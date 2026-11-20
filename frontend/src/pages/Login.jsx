
/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* LUXRIDE — PREMIUM EMAIL LOGIN */

import { useState } from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  Mail,
} from "lucide-react";

import { requestOTP } from "../services/authService";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* LOGIN FORM SUBMISSION */
  const submit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      /* REQUEST LOGIN OTP */
      await requestOTP({
        email: cleanEmail,
        mode: "login",
      });

      /* NAVIGATE TO OTP VERIFICATION */
      navigate("/verify-otp", {
        state: {
          email: cleanEmail,
          mode: "login",
          from: location.state?.from,
        },
      });

    } catch (err) {
      setError(
        err?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* BRAND */}
        <div className="auth-brand">
          LUX<span>RIDE</span>
        </div>

        <p className="auth-eyebrow">
          WELCOME BACK
        </p>

        <h1>
          Travel beautifully.
        </h1>

        <p className="auth-description">
          Sign in to manage your journeys and reservations.
        </p>

        {/* LOGIN FORM */}
        <form onSubmit={submit}>

          <label className="auth-label">
            EMAIL ADDRESS
          </label>

          <div className="auth-field">
            <Mail size={18} />

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              "SENDING OTP..."
            ) : (
              <>
                CONTINUE WITH EMAIL
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        {/* REGISTER LINK */}
        <p className="auth-switch">
          New to LuxRide?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

        {/* SECURITY MESSAGE */}
        <p className="auth-terms">
          Secure sign-in with email verification.
          No password required.
        </p>

      </section>
    </main>
  );
}
