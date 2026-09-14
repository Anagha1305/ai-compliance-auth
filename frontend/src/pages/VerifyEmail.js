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

        <h1>Verify Email</h1>

        <p className="auth-subtitle">
          Enter the verification code sent to
        </p>

        <p style={{ textAlign: "center" }}>
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <label>Verification Code</label>

          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(event) =>
              setOtp(event.target.value)
            }
            maxLength="6"
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
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>

        <p className="auth-footer">
          <Link to="/signup">
            Back to Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;