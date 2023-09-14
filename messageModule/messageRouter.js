import { Router } from "express";
import messageController from "./messageController.js";
import authMiddleware, {
  isActivatedMiddleware
} from "../middleware/auth-middleware.js";
export const messageRouter = new Router();

messageRouter.put(
  "/accept/",
  authMiddleware,
  isActivatedMiddleware,
  messageController.accpetInvitation
);
messageRouter.put(
  "/decline/",
  authMiddleware,
  isActivatedMiddleware,
  messageController.declineInvitation
);
messageRouter.delete(
  "/delete/",
  authMiddleware,
  isActivatedMiddleware,
  messageController.deleteMessage
);
