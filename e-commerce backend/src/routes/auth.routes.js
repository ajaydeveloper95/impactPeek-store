import express from "express";
import { registerUser, logInUser } from "../controller/auth.controller.js";

const authRoutes = express.Router();

authRoutes.use(express.urlencoded({ extended: true }));
authRoutes.use(express.json());

authRoutes.post("/signUp", registerUser);
authRoutes.post("/logIn", logInUser);

export default authRoutes;
