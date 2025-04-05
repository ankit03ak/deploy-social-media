import { useContext, useRef, useState } from "react";
import "./login.css";
import { AuthContext } from "../../context/AuthContext";
import { FaCircleNotch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../apiCalls";

function Login() {
  const email = useRef();
  const password = useRef();
  const { dispatch, isFetching } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue to Socio-Zone</p>
        </div>
        <form className="login-form" onSubmit={handleClick}>
          <input
            placeholder="Email"
            type="email"
            required
            className="login-input"
            ref={email}
            autoComplete="email"
          />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            className="login-input"
            ref={password}
            autoComplete="current-password"
          />
          {error && <div className="error-message">{error}</div>}
          <button className="login-button" type="submit" disabled={isFetching}>
            {isFetching ? (
              <FaCircleNotch className="spinner-icon" />
            ) : (
              "Log In"
            )}
          </button>
          <div className="login-footer">
            <span className="forgot-password">Forgot Password?</span>
            <button
              className="register-button"
              type="button"
              onClick={handleRegister}
            >
              Create a New Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
