import express, { Router } from "express";
import { signup } from "../controller/auth/signup.controller";
import { verifyEmail } from "../controller/auth/verifyEmail.controller";
import resendVerifyEmail from "../controller/auth/ResendVerifyEmail.controller";
import signin from "../controller/auth/signin.controller"

const authRoutes: Router = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/resend-verify-email", resendVerifyEmail);
authRoutes.post("/signin", signin);

export default authRoutes;