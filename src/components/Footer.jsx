import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row text-center text-md-left">
            {/* Address Section */}
            <div className="col-md-2 mb-2">
            <img src="/assets/logo.png"  style={{
                        width:'80%'}}></img>
            </div>
            <div className="col-md-4 mb-4">
            
              <h5 className="text-uppercase mb-3">Our Address</h5> 
              <p>
              Floor No.:  A-12 2nd Floor, <br />
              Shree Kanhaiya Mansion,<br />
              Vaishali Nagar, Jaipur,Rajasthan 302021
              </p>
            </div>
         

            {/* Contact Section */}
            <div className="col-md-4 mb-4">
              <h5 className="text-uppercase mb-3">Contact Us</h5>
              <p>Email: <a href="mailto:impactpeakpvtltd@gmail.com" className="text-white">impactpeakpvtltd@gmail.com</a></p>
              <p>Phone: <a href="tel:+91-7727067599" className="text-white">+91-7727067599</a></p>
              <p>Support: <a href="mailto:support@impactstore.in" className="text-white">support@impactstore.in</a></p>
            </div>

            {/* Social Media Section */}
            <div className="col-md-2 mb-2">
              <h5 className="text-uppercase mb-3">Follow Us</h5>
              <p>
                <a href="https://facebook.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://twitter.com" className="text-white me-3" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://linkedin.com" className="text-white" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </p>
            </div>
          </div>

          <div className="text-center border-top pt-3 mt-3">
            <p className="mb-0">© {new Date().getFullYear()} Impactpeak Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
