import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserRound, Mail } from "lucide-react";
import { requestOTP } from "../services/authService";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      await requestOTP({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mode: "register",
      });

      navigate("/verify-otp", {
        state: { ...form, email: form.email.trim().toLowerCase(), mode: "register" },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">LUX<span>RIDE</span></div>
        <p className="auth-eyebrow">YOUR JOURNEY BEGINS HERE</p>
        <h1>Create your account</h1>
        <p className="auth-description">
          Join LuxRide for a more refined travel experience.
        </p>

        <form onSubmit={submit}>
          <label className="auth-label">FULL NAME</label>
          <div className="auth-field">
            <UserRound size={18} />
            <input
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={update}
              required
              maxLength={80}
            />
          </div>

          <label className="auth-label">EMAIL ADDRESS</label>
          <div className="auth-field">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "SENDING OTP..." : <>CREATE ACCOUNT <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="auth-switch">
          Already a member? <Link to="/login">Sign in</Link>
        </p>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}