import Router from "express";
import todoController from "./controller/todo.controller.js";
import authMiddleware, {
  isActivatedMiddleware
} from "../middleware/auth-middleware.js";

const todoRouter = new Router();

todoRouter.post(
  "/todo",
  authMiddleware,
  isActivatedMiddleware,
  todoController.addTodo
);
todoRouter.patch(
  "/todo",
  authMiddleware,
  isActivatedMiddleware,
  todoController.updateTodo
);
todoRouter.delete(
  "/todo",
  authMiddleware,
  isActivatedMiddleware,
  todoController.deleteTodo
);
todoRouter.get(
  "/todo",
  authMiddleware,
  isActivatedMiddleware,
  todoController.getTodos
);
export default todoRouter;
