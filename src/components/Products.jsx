import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://ajay.yunicare.in/api/product/getproducts"
        );
        if (response.status === 200) {
          const filtered = response.data.products.filter(
            (product) =>
              product.category.toLowerCase() !== "mensclothing" &&
              product.category.toLowerCase() !== "children clothing"
          );
          setProducts(filtered);
          setFilteredProducts(filtered);
        } else {
          console.error("Failed to fetch products:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const Loading = () => (
    <div className="row justify-content-center">
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4" key={index}>
          <Skeleton height={592} />
        </div>
      ))}
    </div>
  );

  const ShowProducts = () => {
    if (!Array.isArray(currentProducts) || currentProducts.length === 0) {
      return <div className="text-center">No products available.</div>;
    }

    return (
      <div className="row justify-content-center">
        {currentProducts.map((product, index) => (
          <div
            key={product._id}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <div
              className="card text-center h-100 shadow-sm border-0"
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                // overflow: "hidden",
                transition: "transform 0.3s ease",
              }}
            >
              {/* <img
                className="card-img-top p-3"
                src={product.images?.[0] || product.image}
                alt={product.productName}
                height={300}
                style={{
                  objectFit: "contain",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                }}
              /> */}

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


              <div
                className="card-body"
                style={{ padding: "20px", textAlign: "center" }}
              >
                <h5
                  className="card-title"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  {product.productName.substring(0, 20)}...
                </h5>
                <p
                  className="card-text text-muted"
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  {product.description.substring(0, 90)}...
                </p>
              </div>

              <div className="mb-3" style={{ display: "flex", justifyContent: "space-around" }}>
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


              {/* <ul className="list-group list-group-flush">
  <li
    className=""
    style={{
      fontSize: "1rem",
      color: "#f15b2a",
      fontWeight: "bold",
    }}
  >
    Rs. {product.price}
  </li>
  <li
    className="text-muted"
    style={{
      fontSize: "0.9rem",
      color: "#999",
      textDecoration: "line-through",
    }}
  >
    <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
      Rs. {Math.round(product.price * 0.75)}
    </span> (25% off)
  </li>
</ul> */}
              <div className="list-group list-group-flush">
                <span
                  className=""
                  style={{
                    fontSize: "1rem",
                    color: "#f15b2a",
                    fontWeight: "bold",
                  }}
                >

                  Rs. {product.actualPrice === 0 ? product.price : product.actualPrice}
                  {product.actualPrice !== 0 && (
                    ` (${Math.floor(((product.price - product.actualPrice) / product.price) * 100)}%)`
                  )}                
                </span>
                <span
                  className="text-muted"
                  style={{
                    fontSize: "0.9rem",
                    color: "#999",
                    textDecoration: "line-through",
                  }}
                >
                  <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    Rs. {(product.price)}
                  </span>
                </span>
              </div>


              <div className="card-body">
                <Link
                  to={`/getproduct/${product._id}`}
                  className="btn btn-primary m-1"
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  Buy Now
                </Link>
                <button
                  className="btn btn-outline-dark m-1"
                  onClick={() => addProduct(product)}
                  style={{
                    borderRadius: "8px",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container my-4 py-4">
      <div className="row">
        <div className="col-12">
          <h2
            className="display-5 text-center"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #ff6a00, #ee0979)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
              letterSpacing: "3px",
              marginBottom: "1.5rem",
            }}
          >
            🌟 Latest Products 🌟
          </h2>
          <hr />
        </div>
        <div className="col-12 mb-4">
          <input
            type="text"
            className="form-control p-3"
            placeholder="Search by category (e.g., Women's Clothing)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "8px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              border: "1px solid #ccc",
              padding: "12px",
              fontSize: "1rem",
            }}
          />
        </div>
      </div>
      {loading ? <Loading /> : <ShowProducts />}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          style={{ borderRadius: "8px", padding: "10px 20px" }}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{ borderRadius: "8px", padding: "10px 20px" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
