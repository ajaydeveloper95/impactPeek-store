import React from "react";
import { Footer, Navbar } from "../components";
const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">About Us</h1>
        <hr />
        <p className="lead text-center">
          Welcome to Impactstore.in—your one-stop e-commerce destination for
          high-quality products across various categories for Women Clothing . Our mission is to provide
          our customers with an exceptional shopping experience by offering a
          diverse range of products at competitive prices. Whether you’re a tech
          enthusiast looking for the latest gadgets or a fashion lover seeking
          trendy attire, we have something for everyone. All our products are
          sourced from trusted suppliers, ensuring top-notch quality with every
          purchase.
        </p>

        <h2 className="text-center py-4">Our Products</h2>
        <div className="row justify-content-center">
          {/* <div className="col-md-3 col-sm-6 mb-6 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Mens's Clothing</h5>
              </div>
            </div>
          </div> */}
          <div className="col-md-12 col-sm-6 mb-6 px-3">
            <div className="card h-100">
              <img
                className="card-img-top img-fluid"
                src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt=""
                height={160}
              />
              <div className="card-body">
                <h5 className="card-title text-center">Women's Clothing</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
