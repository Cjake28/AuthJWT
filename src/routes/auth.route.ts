import express, { Router } from "express";
import { signup } from "../controller/auth/signup.controller";


const authRoutes: Router = express.Router();

authRoutes.post("/signup", signup);

export default authRoutes;