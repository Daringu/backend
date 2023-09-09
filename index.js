import express, { json } from "express";
import mongoose from "mongoose";
import userRouter from "./userModule/user.router.js";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/error-middleware.js";
import cookieParser from "cookie-parser";
import todoRouter from "./todos-module/todo.router.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: process.env.CLIENT_URL
  }
});

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL
  })
);
app.use(json());
app.use(cookieParser());
app.use("/api", userRouter);
app.use("/api", todoRouter);
app.use(errorMiddleware);

const DB_URL = process.env.DB_URL;
io.on("connection", socket => {
  console.log("a user connected");
  socket.on("message", message => {
    io.emit("message", message);
  });
});

const start = async () => {
  const db = await mongoose.connect(DB_URL);
  httpServer.listen(PORT, () => {
    console.log(`server has started at port ${PORT}`);
  });
};

start();
