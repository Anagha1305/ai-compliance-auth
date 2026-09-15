import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="landing-page">
      <div className="landing-card">

        <div className="landing-icon">
          ✓
        </div>

        <h1>Welcome to AI Compliance Inspector</h1>

        <p className="landing-description">
          Your account has been successfully authenticated.
          You are ready to access the compliance inspection workspace.
        </p>

        {user && (
          <div className="user-info">
            <p className="user-name">
              {user.name}
            </p>

            <p className="user-email">
              {user.email}
            </p>
          </div>
        )}

        <div className="landing-actions">

          <button
            className="primary-button continue-button"
            onClick={() =>
              alert("Compliance workspace will be integrated here.")
            }
          >
            Continue to Workspace
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div className="security-note">
          <span>🔒</span>
          Secure session active
        </div>

      </div>
    </div>
  );
}

export default Landing;