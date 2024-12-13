// /src/api/axiosInstance.js
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: "https://ajay.yunicare.in",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    // Store the refresh token in localStorage when a successful response is received
    if (res.data?.data?.accessToken) {
      localStorage.setItem("accessToken", res.data.data.accessToken);
    }
    return res;
  },
  (err) => {
    // Optionally handle errors
    // return Promise.reject(err);
    HandleAxiosError(err); // Call the error handler function
    return Promise.reject(err);
  }
);



export { axiosInstance };


export const HandleAxiosError = (err) => {
  const navigate= useNavigate();

  if (!err) {
    return;
  }

  // Handling token errors (e.g., invalid or expired token)
  if (err.response?.status === 401) {
    // Remove invalid or expired token
    if (
      localStorage.getItem("accessToken") !== "undefined" &&
      localStorage.getItem("accessToken") !== null
    ) {
      localStorage.removeItem("accessToken");
    }

    // Optionally remove the refreshToken as well, if needed
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  }

  // You can also add handling for other error statuses, e.g., 500 for server errors
  if (err.response?.status === 500) {
    console.error("Server error occurred");
  }
};

