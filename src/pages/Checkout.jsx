import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
  });
  const [paymentUrl, setPaymentUrl] = useState(null); // For storing payment URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const txnid = `tgD59N${Date.now()}`;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true); // Set loading to true while the request is being made

    // Prepare order data
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    const orderData = {
      // customer: "674ebe5b442c02e830bc3e83", // Static customer ID, can be dynamic if available
      products: cartItems.map((item) => ({
        product: item._id, // Assuming each item has a product ID
        quantity: item.qty,
        price: item.price,
      })),
      totalAmount: totalAmount,
      shippingAddress: JSON.stringify({
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        pincode: formData.pincode,
        country: formData.country,
        state: formData.state,
      }),
      paymentMethod: "paypal", // Adjust this based on actual payment method
    };

    try {
      // First, place the order
      const orderResponse = await axios.post(
        "https://ajay.yunicare.in/api/order/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // If order is successful, proceed with payment
      let postReqURl = "https://payment.yunicare.in/payment/ImpactStoreGeneratePayment";
      let postData = {
        trxId: txnid,
        amount: String(totalAmount), // Ensure you send the correct amount
        redirectUrl: "http://impactstore.in/cart"
      };

      const response = await axios.post(postReqURl, postData);
      const url = response?.data?.data?.data?.payment_url;
      setPaymentUrl(url); // Set the payment URL

    } catch (err) {
      console.error("Order or payment request failed:", err);
      setLoading(false);
    }
  };

  // Redirect to payment URL when it's set
  useEffect(() => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank"); // Automatically redirect to payment URL in a new tab
    }
  }, [paymentUrl]);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        <h3>Your Cart Items</h3>
        {/* <div className="mb-4">
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item) => (
                <li key={item._id}>
                  {item.title} x {item.qty} = Rs. {item.price * item.qty}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in the cart.</p>
          )}
        </div> */}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="col-md-6">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row mt-3">
            <div className="col-md-6">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label>Mobile No</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row mt-3">
            <div className="col-md-12">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row mt-3">
            <div className="col-md-6">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row mt-3">
            <div className="col-md-6">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-dark btn-lg btn-block"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
