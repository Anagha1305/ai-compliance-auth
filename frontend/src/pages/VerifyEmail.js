import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      navigate("/signup", {
        state: {
          email,
          verified: true,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="brand-mark">
          ✓
        </div>

        <h1>Verify your email</h1>

        <p className="auth-subtitle">
          We've sent a 6-digit verification code to
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "-12px",
            marginBottom: "25px",
            color: "#0f172a",
            fontSize: "14px",
            wordBreak: "break-word",
          }}
        >
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <label htmlFor="otp">
            Verification code
          </label>

          <input
            id="otp"
            className="otp-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="000000"
            value={otp}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 6);

              setOtp(value);
            }}
            maxLength="6"
            autoComplete="one-time-code"
            required
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

        </form>

        <div className="security-note">
          <span>✉</span>
          Check your inbox for the verification code
        </div>

        <p className="auth-footer">
          <Link to="/signup">
            ← Back to Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;