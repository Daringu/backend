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
import teamRouter from "./teamModule/teamRouter.js";
import {
  handleAddTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  sendInvitation
} from "./ws-handlers/handlers.js";
import Team from "./schemas/user/Team.js";
import { messageRouter } from "./messageModule/messageRouter.js";

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

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  })
);

app.use(json());

app.use("/api", userRouter);
app.use("/api", todoRouter);
app.use("/api/team", teamRouter);
app.use("/api/message", messageRouter);
app.use(errorMiddleware);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("join-team", async ({ teamId, userId }) => {
    try {
      const team = await Team.findById(teamId);
      if (!team.users.includes(userId)) {
        throw new Error("You are not a member of this team");
      }
      socket.join(teamId);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("join-user-room", userId => {
    socket.join(userId);
    console.log("joined", userId);
    socket.emit("joined-user-room", userId);
  });
  handleUpdateTodo(io, socket);
  handleAddTodo(io, socket);
  handleDeleteTodo(io, socket);
  sendInvitation(io, socket);
});

const DB_URL = process.env.DB_URL;

const start = async () => {
  const db = await mongoose.connect(DB_URL);
  httpServer.listen(PORT, () => {
    console.log(`server has started at port ${PORT}`);
  });
};

start();
