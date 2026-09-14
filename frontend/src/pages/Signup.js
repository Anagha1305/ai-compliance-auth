import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { apiRequest } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const verifiedEmail = location.state?.email || "";
  const isVerified = location.state?.verified || false;

  const [email, setEmail] = useState(verifiedEmail);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOTP(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });

      navigate("/verify-email", {
        state: {
          email,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      navigate("/", {
        state: {
          message: "Account created successfully!",
          user: data.user,
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignup() {
    window.location.href =
      "http://127.0.0.1:8000/api/auth/google";
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>AI Compliance Inspector</h1>

        <p className="auth-subtitle">
          {isVerified
            ? "Complete your account"
            : "Create your account"}
        </p>

        {!isVerified && (
          <>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignup}
            >
              Continue with Google
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <form onSubmit={handleSendOTP}>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
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
                  ? "Sending code..."
                  : "Continue with Email"}
              </button>

            </form>
          </>
        )}

        {isVerified && (
          <form onSubmit={handleRegister}>

            <label>Verified Email</label>

            <input
              type="email"
              value={email}
              disabled
            />

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
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
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>
        )}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;