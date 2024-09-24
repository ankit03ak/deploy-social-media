import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../..https://deploy-social-media-ap1.onrender.com/apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { FaCircleNotch } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function Login() {
    const email = useRef();
    const password = useRef();
    const { dispatch, isFetching } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">𝓢𝓸𝓬𝓲𝓸-𝓩𝓸𝓷𝓮</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on 𝓢𝓸𝓬𝓲𝓸-𝓩𝓸𝓷𝓮.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" required className="loginInput" ref={email} autoComplete="email" />
                        <input placeholder="Password" type="password" required minLength="6" className="loginInput" ref={password} autoComplete="current-password" />
                        {error && <div className="error-message">{error}</div>}
                        <button className="loginButton" type="submit" disabled={isFetching}>
                            {isFetching ? <FaCircleNotch className="spinner-icon" /> : "Log In"}
                        </button>
                        <span className="loginForgot">Forgot Password?</span>
                        <button className="loginRegisterButton" onClick={handleRegister}>
                            Create a New Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
