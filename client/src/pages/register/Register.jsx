import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "./register.css";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCircleNotch } from "react-icons/fa";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

 const handleClick = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  if (passwordAgain.current.value !== password.current.value) {
    setError("Passwords do not match.");
    toast.error("Passwords do not match.");
    setIsLoading(false);
    return;
  }

  const user = {
    username: username.current.value,
    email: email.current.value,
    password: password.current.value,
  };

  try {
    await axios.post(
      "https://deploy-social-media-ap1.onrender.com/api/auth/register",
      user
    );
    toast.success("Registration successful! Please login.");
    navigate("/login");
  } catch (error) {
    const backendError =
      error.response?.data?.message || "Registration failed. Please try again.";
    setError(backendError);
    toast.error(backendError);
  }
};


  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Join Socio-Zone</h2>
          <p className="register-subtitle">Sign up to start connecting</p>
        </div>
        <form className="register-form" onSubmit={handleClick}>
          <input
            placeholder="Username"
            required
            ref={username}
            className="register-input"
          />
          <input
            placeholder="Email"
            required
            type="email"
            ref={email}
            className="register-input"
          />
          <input
            placeholder="Password"
            required
            minLength="6"
            type="password"
            ref={password}
            className="register-input"
          />
          <input
            placeholder="Confirm Password"
            required
            type="password"
            ref={passwordAgain}
            className="register-input"
          />
          {error && <div className="error-message">{error}</div>}
          <button className="register-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <FaCircleNotch className="spinner-icon" />
            ) : (
              "Sign Up"
            )}
          </button>
          <div className="register-footer">
            <span className="already-account">Already have an account?</span>
            <button className="login-button" type="button" onClick={handleLogin}>
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// JUST AADED TOAST IN  LOGIN, register, logout, and upload also, and one more thing after toast for upload i added settimeout which was earlier like only window.location.reload so do that, may be error solve
