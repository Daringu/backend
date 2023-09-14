import { Router } from "express";
import teamController from "./teamController.js";
import authMiddleware, {
  isActivatedMiddleware
} from "../middleware/auth-middleware.js";
import { isInTeamMiddleware } from "../middleware/isInTeam-middleware.js";

const teamRouter = new Router();

teamRouter.post(
  "/create",
  authMiddleware,
  isActivatedMiddleware,
  teamController.createNewTeam
);
teamRouter.get(
  "/:teamId",
  authMiddleware,
  isActivatedMiddleware,
  isInTeamMiddleware,
  teamController.getTeam
);
teamRouter.delete(
  "/delete",
  authMiddleware,
  isActivatedMiddleware,
  isInTeamMiddleware,
  teamController.deleteTeam
);
export default teamRouter;
