import { useContext } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Messenger from "./pages/messagenger/Messenger.jsx";

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes> 
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
