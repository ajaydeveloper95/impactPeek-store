import express from "express";
import cors from "cors";
import { DBConnection } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js"; // Assuming you have the product routes file
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

DBConnection();

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
