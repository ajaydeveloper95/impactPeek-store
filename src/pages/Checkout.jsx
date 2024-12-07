import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const [paymentUrl, setPaymentUrl] = useState(""); // State to store payment URL
  const [loading, setLoading] = useState(false); // State to handle loading state during payment URL fetch
  const [amount, setAmount] = useState(0);
  const token = localStorage.getItem("accessToken");
  const EmptyCart = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 py-5 bg-light text-center">
            <h4 className="p-3 display-5">No item in Cart</h4>
            <Link to="/" className="btn btn-outline-dark mx-4">
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ShowCheckout = () => {
    const [data, setData] = useState({});
    let onHandleCart = (event) => {
      let { id, value } = event.target;
      setData((val) => ({ ...val, [id]: value }));
    };

    let subtotal = 0;
    let shipping = 30.0;
    let totalItems = 0;

    state.map((item) => {
      subtotal += item.price * item.qty;
      setAmount(subtotal + shipping)
      totalItems += item.qty;
      return null;
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validate form
      if (
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        !data.mobileNumber ||
        !data.address
      ) {
        alert("Please fill in all required fields.");
        return;
      }
  
      const shippingAddress = {
        address: data.address,
        country: data.country,
        state: data.state,
      };
  
      const customer = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.mobileNumber,
      };
  
      const products = state.map((item) => ({
        product: item.id, // Replace with your product ID field
        quantity: item.qty,
      }));
  
      const orderPayload = { customer, products, shippingAddress };
  
      setLoading(true);
  
      try {
        // Step 1: Create Order
        const orderResponse = await axios.post(
          "https://ajay.yunicare.in/api/order/orders",
          orderPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure you have `token` defined and valid
            },
          }
        );
  
        if (orderResponse.status === 201) {
          const orderId = orderResponse.data.order._id;
          const totalAmount = orderResponse.data.order.totalAmount;
  
          // Step 2: Generate Payment URL
          const txnid = `tgD59N${Date.now()}`;
          const paymentPayload = {
            trxId: txnid,
            amount: String(totalAmount),
            redirectUrl: "http://impactstore.in/cart", // Update with your redirect URL
          };
  
          const paymentResponse = await axios.post(
            "https://payment.yunicare.in/payment/ImpactStoreGeneratePayment",
            paymentPayload
          );
  
          const url = paymentResponse?.data?.data?.data?.payment_url;
          if (url) {
            setPaymentUrl(url);
          } else {
            alert("Failed to generate payment URL.");
          }
        } else {
          alert("Failed to create order. Please try again.");
        }
      } catch (error) {
        console.error("Error during order/payment processing:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    // Redirect to payment URL when it's set
    React.useEffect(() => {
      if (paymentUrl) {
        window.open(paymentUrl, "_blank"); // Automatically redirect to payment URL in a new tab
      }
    }, [paymentUrl]);

    return (
      <>
        <div className="container py-5">
          <div className="row my-4">
            <div className="col-md-5 col-lg-4 order-md-last">
              <div className="card mb-4">
                <div className="card-header py-3 bg-light">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products ({totalItems})
                      <span>Rs.{Math.round(subtotal)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>Rs.{shipping}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span>
                        <strong>Rs.{Math.round(subtotal + shipping)}</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Billing address</h4>
                </div>
                <div className="card-body">
                  <form
                    className="needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="row g-3">
                      <div className="col-sm-6 my-1">
                        <label htmlFor="firstName" className="form-label">
                          First name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          value={data?.firstName}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      <div className="col-sm-6 my-1">
                        <label htmlFor="lastName" className="form-label">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          value={data?.lastName}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      <div className="col-12 my-1">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="you@example.com"
                          value={data?.email}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      <div className="col-12 my-1">
                        <label htmlFor="mobileNumber" className="form-label">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="mobileNumber"
                          value={data?.mobileNumber}
                          onChange={onHandleCart}
                          required
                        />
                      </div>

                      <div className="col-12 my-1">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          value={data?.address}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      <div className="col-6 my-1">
                        <label htmlFor="country" className="form-label">
                        Country
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          value={data?.country}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      <div className="col-6 my-1">
                        <label htmlFor="State" className="form-label">
                          State
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          value={data?.state}
                          onChange={onHandleCart}
                          required
                        />
                      </div>
                      
                    </div>
                    <hr className="my-4" />
                    <button className="w-100 btn btn-primary" type="submit">
                      {loading ? "Processing..." : "Continue to checkout"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? <ShowCheckout /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;