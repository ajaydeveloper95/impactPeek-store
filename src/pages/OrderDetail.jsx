import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, Spinner } from "react-bootstrap";
import axios from "axios";

const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiEndpoint = "https://ajay.yunicare.in/api/order/orders";
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
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
                {order.products.map((item, index) => {
                  const product = item.product;
                  const imageUrl =
                    product && product.image
                      ? product.image
                      : "/path/to/placeholder-image.jpg";

                  return (
                    <Col md={3} key={index}>
                      <img
                        src={imageUrl}
                        alt={product ? product.productName : "Unavailable"}
                        className="img-fluid rounded mb-3"
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
                        return address.name || "N/A";
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
