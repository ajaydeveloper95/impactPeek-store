import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Spinner,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { Footer, Navbar } from "../components";

const OrderDetail = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchInput, setSearchInput] = useState("");
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
      <Container className="mt-4 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Order Details</h1>
          <div>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by Order ID"
                value={searchInput}
                onChange={handleSearch}
              />
              <Button variant="success" onClick={() => handleSearch({ target: { value: searchInput } })}>
                Search
              </Button>
            </InputGroup>
          </div>
          <Button variant="success" onClick={handleExport}>
            Export Orders
          </Button>
        </div>
       
        {error && <p className="text-center text-danger">{error}</p>}
        {filteredOrders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
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
                      <Col md={3} key={index}>
                        <img
                          src={imageUrl}
                          alt={
                            product ? product.productName : "Unavailable"
                          }
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
      <Footer />
    </>
  );
};

export default OrderDetail;
