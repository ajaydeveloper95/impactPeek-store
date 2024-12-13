import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiPost } from "../api/apiMethods";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Use apiPost method instead of axios directly
  //     const res = await apiPost('api/auth/logIn', {
  //       email,
  //       password
  //     });

  //     if (res.data.statusCode === 200) {
  //       localStorage.setItem("accessToken", res.data.data.accessToken);
  //       localStorage.setItem("refreshToken", res.data.data.refreshToken);

  //       toast.success("Login successful!");

  //       setTimeout(() => {
  //         navigate("/");
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     setMessage(error.response?.data?.message || "Login failed. Please try again.");
  //     toast.error("Login failed!");
  //   }
  // };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await apiPost('api/auth/logIn', {
      email,
      password
    });

    if (res.status === 200) {
      // Save the access token to localStorage
      localStorage.setItem("accessToken", res.data.accessToken); 
      // localStorage.setItem("refreshToken", res.data.data.refreshToken);
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/"); // Redirect to homepage after login
      }, 2000);
    }
  } catch (error) {
    setMessage(error.response?.data?.message || "Login failed. Please try again.");
    toast.error("Login failed!");
  }
};

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleLogin}>
              <div className="my-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <p>
                  New Here?{" "}
                  <Link to="/register" className="text-decoration-underline text-info">
                    Register
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
              {message && (
                <div className="alert alert-info mt-3" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default Login;
