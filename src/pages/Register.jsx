import React, { useState } from 'react';
import { Footer, Navbar } from '../components';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import { apiPost } from '../api/apiMethods';

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    memberType: 'Admin',
    isActive: true,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiPost('api/auth/signUp', formData);
      setMessage('User registered successfully');
      setTimeout(() => navigate('/login'), 2000); // Navigate to /login after 2 seconds
    } catch (error) {
      // Handle duplicate email error specifically
      if (error.response && error.response.data.includes('duplicate key error')) {
        setMessage('email already exists. Please use a different email address.');
      } else {
        setMessage('Error registering user: ' + (error.response?.data || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Register</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="form my-3">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter Your First Name"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Your Last Name"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="email">email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="form my-3">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="my-3">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-underline text-info">
                    Login
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
            {message && <p className="text-center my-3 text-success">{message}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
