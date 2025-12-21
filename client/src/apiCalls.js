// import axios from "axios"
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";
// export const loginCall = async (userCredential, dispatch) => {
//   dispatch({ type: "LOGIN_START" });
//   try {
//     const res = await axios.post(
//       // "https://deploy-social-media-ap1.onrender.com/api/auth/login",
//       `${API_BASE_URL}/api/auth/login`,
//       userCredential
//     );
//     dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
//     return res.data;
//   } catch (error) {
//     dispatch({ type: "LOGIN_FAILURE", payload: error });
//     throw error;
//   }
// };


import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginCall = async (userCredential, dispatch) => {
  
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await api.post("/api/auth/login", userCredential);

    // console.log("LOGIN RESPONSE:", res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);

    
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: res.data.user,
    });

    return res.data;
  } catch (error) {
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGIN_FAILURE" });
    throw error;
  }
};
export const registerCall = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
};


export default api;
