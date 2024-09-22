import {useNavigate } from "react-router-dom"
import { useRef } from "react";
import "./register.css";
import axios from "axios"


export default function Register() {

  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const navigate = useNavigate();



  const handleClick = async (e) => {
    e.preventDefault();
    if(passwordAgain.current.value !== password.current.value){
      passwordAgain.current.setCustomValidity("Password don't match");
    }
    else{
      const user = {
        username : username.current.value,
        email : email.current.value,
        password : password.current.value,
      };
      try {
        await axios.post("/auth/register",user);
        navigate("/login")
        // console.log(res.data)
      } catch (error) {
        console.log(error.message)
      }
    }
  }


const handleLogin = () => {
  navigate("/login")
}

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">𝓢𝓸𝓬𝓲𝓸-𝓩𝓸𝓷𝓮</h3>
          <span className="loginDesc">
            Connect with friends around world and explore things 
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" required ref={username} className="loginInput" />
            <input placeholder="Email" required type="email" ref={email} className="loginInput" />
            <input placeholder="Password" required minLength="6" type="password" ref={password} className="loginInput" />
            <input placeholder="Confirm Password" required type="password" ref={passwordAgain} className="loginInput" />
            <button className="loginButton" type="submit">
             
            Sign Up
              </button>
            <button className="loginRegisterButton" onClick={handleLogin}>
              Already have an account ?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}