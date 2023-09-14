import { Router } from "express";
import userController from "./controller/user.controller.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth-middleware.js";
const userRouter = new Router();

userRouter.post(
  "/registrate",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: "32" }),
  userController.createNewUser
);
userRouter.post("/login", userController.loginUser);
userRouter.get("/activate/:link", userController.verifyEmail);
userRouter.post("/logout", userController.logOut);
userRouter.get("/refresh", userController.refresh);
userRouter.get("/authorize", authMiddleware, userController.authorize);
export default userRouter;
