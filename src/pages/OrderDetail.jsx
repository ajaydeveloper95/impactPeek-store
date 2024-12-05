import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import axios from "axios";

const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiEndpoint = "https://ajay.yunicare.in/api/order/orders"; // Your API endpoint
  const token = localStorage.getItem("accessToken");

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
      } catch (error) {
        setError("Error fetching orders. Please try again.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Order Details</h1>
      {error && <p className="text-center text-danger">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card className="mb-3" key={order._id}>
            <Card.Header className="d-flex justify-content-between">
              <span>
                <strong>Order ID:</strong> {order._id}
              </span>
              <Badge bg={order.status === "pending" ? "warning" : "success"}>
                {order.status}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                {order.products.map((item) => (
                  <Col md={3} key={item._id}>
                    <img
                      src={item.product.image}
                      alt={item.product.productName}
                      className="img-fluid rounded mb-3"
                    />
                  </Col>
                ))}
                <Col>
                  <h5>
                    {order.products[0].product.productName}{" "}
                    {order.products.length > 1 && (
                      <small>(+{order.products.length - 1} more)</small>
                    )}
                  </h5>
                  <p>
                    <strong>Customer:</strong> {order.customer.email}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong>{" "}
                    {order.shippingAddress ? JSON.parse(order.shippingAddress).name : "N/A"}
                  </p>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderDetail;
