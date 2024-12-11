import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiEndpoint = `https://ajay.yunicare.in/api/order/orders/${orderId}`;

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "landscape", // or 'portrait' based on your preference
      unit: "mm",
      format: "a4", // A4 size
    });
  
    // const margin = 10; // set the margin for both sides
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    // Calculate the width and height of the content to be centered
    const contentWidth = 180; // Width of the content (adjust this as needed)
    const contentHeight = 180; // Height of the content (adjust based on your content)
  
    // Calculate the x and y coordinates to center the content
    const x = (pageWidth - contentWidth) / 2;
    const y = (pageHeight - contentHeight) / 2;
  
    // Render the content to the PDF
    doc.html(document.getElementById("invoice-container"), {
      callback: (doc) => {
        doc.save("invoice.pdf");
      },
      x: x, // Center horizontally
      y: y, // Center vertically
      width: contentWidth, // Width of the content
      windowWidth: 800, // This is the window width to capture the content from the DOM
    });
  };
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No access token found. Please log in.");
          return;
        }

        const response = await axios.get(apiEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data.order);
      } catch (error) {
        setError("Error fetching order details. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!order) {
    return <p className="text-center">No order details available.</p>;
  }

  return (
    <Container>
      <h1 className="my-4">Invoice for Order #{orderId}</h1>
      <div id="invoice-container" style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
        <div style={{ maxWidth: "700px", margin: "auto", padding: "15px", border: "1px solid #000" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <strong style={{ fontSize: "18px" }}>Impactpeak Pvt. Ltd.</strong>
                  <br />
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>Receipt/Tax Invoice</span>
                </td>
              </tr>
              <tr>
  <td colSpan={2} style={{ fontSize: '12px', paddingTop: '5px' }}>
    GST: 08AAHCI8381C1ZF<br />
    Address: Floor No.: A-12 2nd Floor, Shree Kanhaiya Mansion, Vaishali Nagar, Jaipur, Rajasthan 302021
  </td>
  <td colSpan={2} style={{ textAlign: 'right', fontSize: '12px' }}>
    INV No: AWG{order._id}<br />
    Date: {order.txnDate}
  </td>
</tr>

            </tbody>
          </table>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ fontSize: "12px", paddingTop: "5px" }}>
                  Email: impactpeakpvtltd@gmail.com<br />
                  Contact: +91-7727067599
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", border: "1px solid #000", padding: "5px" }}>
                  <strong>To:</strong> {order.customer.email}
                  <br />
                  GST No: N.A.<br />
                  Email: {order.customer.email}<br />
                  Phone: {order.customer.phone || "N.A."}<br />
                  <strong>Address:</strong> {(() => {
                    try {
                      const address = JSON.parse(order.shippingAddress);
                      return `${address.name}, ${address.street}, ${address.city}` || "N/A";
                    } catch {
                      return "Invalid Address Format";
                    }
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
    <tbody>
      <tr>
        <td style={{ border: "1px solid #000", padding: "5px" }}>
          <strong>Order ID: {orderId}</strong><br />
          Order Dated: {order.createdAt}<br />
          Transaction ID: {order.transactionId || "N/A"}<br />
          Transaction Date: {order.txnDate}
        </td>
      </tr>
    </tbody>
  </table>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", border: "1px solid #000" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Description</th>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>QTY</th>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>SAC</th>
                <th style={{ border: "1px solid #000", padding: "8px", textAlign: "right" }}>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>{item.product.productName}</td>
                  <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{item.quantity || 1}</td>
                  <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{item._id}</td>
                  <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right" }}>₹{item.product.price || order.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right" }} colSpan="3">
                  <strong>Total:</strong>
                </td>
                <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right" }}>₹{order.totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "10px" }}>
            <strong>Terms and Conditions</strong>
            <ul style={{ fontSize: "12px" }}>
              <li>Payment will be on Immediate basis.</li>
              <li>All the services from this app are non-refundable.</li>
              <li>This is inclusive of GST.</li>
              <li>This is an electronically generated invoice, hence does not require a signature.</li>
            </ul>
          </div>
          <table style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
  <tbody>
    <tr>
      <td style={{ color: 'red', fontWeight: 'bold', fontSize: '14px' }}>
        PAYMENT TERMS: IMMEDIATE
      </td>
    </tr>
  </tbody>
</table>

<table style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
  <tbody>
    <tr>
      <td style={{ fontSize: '12px' }}>
        IMPACTPEAK PRIVATE LIMITED<br />
        Office address: Floor No.: A-12 2nd Floor, Shree Kanhaiya Mansion, Vaishali Nagar, Jaipur, Rajasthan 302021<br />
        CIN: U47410RJ2024PTC095632 | https://impactstore.in/
      </td>
    </tr>
  </tbody>
</table>

        </div>
      </div>

      <button
        onClick={handleDownload}
        style={{
          display: "block",
          margin: "20px auto",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Download Invoice as PDF
      </button>
    </Container>
  );
};

export default Invoice;
