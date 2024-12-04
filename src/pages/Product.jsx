import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addProduct = (product) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(addCart(product));
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
          `http://localhost:3000/api/product/getproduct/${id}`
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
        <div className="col-md-6 col-sm-12 py-3">
          <img
            className="img-fluid"
            src={product.image}
            alt={product.productName}
            width="400px"
            height="400px"
          />
        </div>
        <div className="col-md-6 col-sm-12 py-5">
          <h4 className="text-uppercase text-muted">{product.category}</h4>
          <h1 className="display-5">{product.productName}</h1>
          <h3 className="display-6 my-4">Rs.{product.price}</h3>
          <p className="lead">{product.description}</p>
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
