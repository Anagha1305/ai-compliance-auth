import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="landing-page">

      <div className="landing-card">

        <h1>Welcome!</h1>

        {user && (
          <>
            <p>
              Hello, <strong>{user.name}</strong>
            </p>

            <p>
              You are successfully authenticated.
            </p>

            <p className="user-email">
              {user.email}
            </p>
          </>
        )}

        <div className="landing-actions">

          <button
            className="primary-button"
            onClick={() =>
              alert("Project dashboard will be integrated later.")
            }
          >
            Continue to Project
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Landing;