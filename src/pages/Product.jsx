import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addProduct = (product) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(addCart(product));
      toast.success("Added to cart");
    } else {
      navigate("/login");
    }
  };

  const handleBuyNow = (product) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(addCart(product));
      navigate("/cart");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://ajay.yunicare.in/api/product/getproduct/${id}`
        );
        const data = await response.json();

        if (response.ok && data.product) {
          setProduct(data.product);
        } else {
          console.error("Error fetching product:", data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        {/* Product Images */}
        <div className="col-md-6 col-sm-12 py-3">
        <Swiper
                modules={[Navigation, Pagination, Autoplay]} // Pass modules here
                navigation
                pagination={{ clickable: true }}
                // autoplay={{ disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                style={{ width: "100%", height: "300px" }}
              >
                {product?.images?.map((imgSrc, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={imgSrc}
                      alt={`${product.productName}-${index}`}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
        </div>

        {/* Product Details */}
        <div className="col-md-6 col-sm-12 py-5">
          <h4 className="text-uppercase text-muted">{product.category}</h4>
          <h1 className="display-5">{product.productName}</h1>
          <h3 className="display-7 my-4">Rs. {Math.round(product.price * 0.75)} (25% off)</h3>
          <h4 className="display-7 my-4" style={{ textDecoration: "line-through", }}>Rs. {product.price}</h4>
          <p className="lead">{product.description}</p>

          <div className="mb-3" style={{display:"flex",justifyContent:"space-between",marginRight:"0px",width:"25%"}}>
                <label htmlFor="size" className="form-label">Select Size</label>
                <select
                  id="size"
                  // className="form-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {/* Displaying fixed size options */}
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>


          <button
            className="btn btn-outline-dark"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-primary mx-3"
            onClick={() => handleBuyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );


  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
