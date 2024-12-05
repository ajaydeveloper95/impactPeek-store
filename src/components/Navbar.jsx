import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('accessToken'); // Retrieve the token
            await axios.post('https://ajay.yunicare.in/api/auth/logOut', {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in the headers
                }
            });

            // Clear tokens from local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            // Show success message via snackbar
            toast.success("Logout successfully", {
                position: "top-right", // Position for snackbar popup
                autoClose: 3000, // Auto close after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Navigate to the login page after a slight delay to let the message show
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed, please try again");
        }
    };

    // Check if the user is logged in
    const isLoggedIn = !!localStorage.getItem('accessToken');

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top"
            style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderBottom: '2px solid #e0e0e0'
            }}
        >
            <div className="container">
                <NavLink
                    className="navbar-brand fw-bold px-2"
                    to="/"
                    style={{
                        width: '10%',
                        background: 'linear-gradient(to right, #ff007f, #5a3f9d, #00bcd4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.8rem',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <img src="/assets/logo.png" alt="Logo" style={{
                        width: '100%',
                    }} />
                </NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/"
                                style={{
                                    fontSize: '1rem',
                                    color: '#555',
                                    padding: '0.5rem 1rem',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    transition: 'color 0.3s',
                                }}
                                activeStyle={{
                                    color: '#f15b2a'
                                }}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/product"
                                style={{
                                    fontSize: '1rem',
                                    color: '#555',
                                    padding: '0.5rem 1rem',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    transition: 'color 0.3s',
                                }}
                                activeStyle={{
                                    color: '#f15b2a'
                                }}
                            >
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/about"
                                style={{
                                    fontSize: '1rem',
                                    color: '#555',
                                    padding: '0.5rem 1rem',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    transition: 'color 0.3s',
                                }}
                                activeStyle={{
                                    color: '#f15b2a'
                                }}
                            >
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/contact"
                                style={{
                                    fontSize: '1rem',
                                    color: '#555',
                                    padding: '0.5rem 1rem',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    transition: 'color 0.3s',
                                }}
                                activeStyle={{
                                    color: '#f15b2a'
                                }}
                            >
                                Contact
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link"
                                to="/orderdetail"
                                style={{
                                    fontSize: '1rem',
                                    color: '#555',
                                    padding: '0.5rem 1rem',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    transition: 'color 0.3s',
                                }}
                                activeStyle={{
                                    color: '#f15b2a'
                                }}
                            >
                                Order History
                            </NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {!isLoggedIn ? (
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2 active"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                        transition: 'background-color 0.3s ease',
                                    }}>
                                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                        transition: 'background-color 0.3s ease',
                                    }}>
                                    <i className="fa fa-user-plus mr-1"></i> Register
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/cart" className="btn btn-outline-dark m-2"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                    }}>
                                    <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
                                </NavLink>
                                <button onClick={handleLogout} className="btn btn-outline-dark m-2"
                                    style={{
                                        padding: '10px 20px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                    }}>
                                    <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </nav>
    );
}

export default Navbar;
