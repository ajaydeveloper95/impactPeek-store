import express from "express";
import { createProduct, deleteProduct, getProduct, getProducts } from "../controller/Product.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const productRoutes = express.Router();

productRoutes.post("/createproduct", createProduct);
productRoutes.get("/getproducts", getProducts);
productRoutes.get("/getproduct/:id", getProduct);
productRoutes.delete("/delete/:id", deleteProduct);

export default productRoutes;
