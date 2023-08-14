import express, { json } from "express";
import mongoose from "mongoose";
import userRouter from "./userModule/user.router.js";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error-middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
app.use(json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use(errorMiddleware);

const DB_URL = process.env.DB_URL;

const start = async () => {
  const db = await mongoose.connect(DB_URL);
  app.listen(PORT, () => {
    console.log(`server has started at port ${PORT}`);
  });
};

start();
