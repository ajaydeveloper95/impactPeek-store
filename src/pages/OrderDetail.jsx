import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { Footer, Navbar } from "../components";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiEndpoint = "https://ajay.yunicare.in/api/order/orders";
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders); // Initialize filteredOrders
      } catch (error) {
        setError("Error fetching orders. Please try again.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    const searchValue = e.target.value.trim().toLowerCase();
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(searchValue)
    );
    setFilteredOrders(filtered);
  };

  const handleInvoiceClick = (orderId) => {
    window.open(`/invoice/${orderId}`, '_blank');
  };

  const handleExport = () => {
    const exportData = filteredOrders.length > 0 ? filteredOrders : orders; // Export filtered or all orders
    const csvContent = [
      ["Order ID", "Customer Email", "Total Amount", "Status", "Payment Method"],
      ...exportData.map((order) => [
        order._id,
        order.customer.email,
        order.totalAmount,
        order.status,
        order.paymentMethod,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      filteredOrders.length > 0
        ? `order_${searchInput || "filtered"}.csv`
        : "orders.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          position: 'fixed',
          top: '85px',
          width: '100%',
          zIndex: '1000',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '50px 10px 10px 10px',
        }}
      >
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-4 text-start mb-3 mb-md-0">
              <h2 style={{ margin: '0', fontWeight: 'bold' }}>Order Details</h2>
            </div>
            <div className="col-12 col-md-8">
              <div className="row g-2">
                <div className="col-8">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Order ID"
                      value={searchInput}
                      onChange={handleSearch}
                      style={{ borderRadius: '8px 0 0 8px' }}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleSearch({ target: { value: searchInput } })}
                      style={{ borderRadius: '0 8px 8px 0' }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="col-4 text-end">
                  <button
                    className="btn btn-success w-100"
                    onClick={handleExport}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                    id="export-btn"
                  >
                    Export Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container className="mt-10 pt-4">
        {error && <p className="text-center text-danger">{error}</p>}
        {filteredOrders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          filteredOrders.map((order) => {
            // Check if any product in the order is unavailable
            const isAnyProductUnavailable = order.products.some(
              (item) => !item.product || !item.product.productName
            );

            return (
              <div style={{ marginTop: '50px',}}>
              <Card className="mb-3" key={order._id}>
                <Card.Header className="d-flex justify-content-between">
                  <span>
                    <strong>Order ID:</strong> {order._id}
                  </span>
                  <Badge
                    bg={order.status === "pending" ? "warning" : "success"}
                  >
                    {order.status}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {order.products.map((item, index) => {
                      const product = item.product;
                      const imageUrl =
                        product && product.image
                          ? product.image
                          : "/path/to/placeholder-image.jpg";

                      return (
                        <Col xs={6} md={3} key={index} className="mb-3">
                          <img
                            src={imageUrl}
                            alt={product ? product.productName : "Unavailable"}
                            className="img-fluid rounded mb-2"
                          />
                         
                        </Col>
                      );
                    })}
                    <Col>
                    <h5>
                      {order.products[0].product
                        ? order.products[0].product.productName
                        : "Product unavailable"}{" "}
                      {order.products.length > 1 && (
                        <small>(+{order.products.length - 1} more)</small>
                      )}
                    </h5>
                      <p>
                        <strong>Customer:</strong> {order.customer.email}
                      </p>
                      <p>
                        <strong>Shipping Address:</strong>{" "}
                        {(() => {
                          try {
                            const address = JSON.parse(order.shippingAddress);
                            return (
                              address.name ||
                              address.street ||
                              address.city ||
                              "N/A"
                            );
                          } catch {
                            return "Invalid Address Format";
                          }
                        })()}
                      </p>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod || "N/A"}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹{order.totalAmount}
                      </p>
                      {/* Only show one "Generate Invoice" button per order */}
                      <Button
                        variant="primary"
                        onClick={() => {
                          if (isAnyProductUnavailable) {
                            alert("One or more products are out of stock, unable to generate invoice.");
                          } else {
                            handleInvoiceClick(order._id);
                          }
                        }}
                        disabled={isAnyProductUnavailable}
                        style={{
                          cursor: isAnyProductUnavailable ? "not-allowed" : "pointer",
                          filter: isAnyProductUnavailable ? "blur(2px)" : "none",
                        }}
                      >
                        Generate Invoice for Full Order
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              </div>
            );
          })
        )}
      </Container>

      <Footer />
    </>
  );
};

export default OrderDetail;
