import express, { Router } from "express";
import { signup } from "../controller/auth/signup.controller";
import { verifyEmail } from "../controller/auth/verifyEmail.controller";

const authRoutes: Router = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/verify-email", verifyEmail);

export default authRoutes;