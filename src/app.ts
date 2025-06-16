import express from "express";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middleware/errorHandler"

import authRoutes from "./routes/auth.route"

import "dotenv/config"

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("api/auth", authRoutes)

app.use(errorHandler);
