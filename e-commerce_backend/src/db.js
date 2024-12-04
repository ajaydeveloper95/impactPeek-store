import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URL;
// const MONGO_URI = "mongodb://localhost:27017/e-commerce"

export const DBConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database:", error.message);
  }
};
