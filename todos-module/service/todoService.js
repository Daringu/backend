import ApiError from "../../exeptions/api-errors.js";
import Todo from "../../schemas/user/Todo.js";
import User from "../../schemas/user/User.js";
import userTodoService from "./userTodo.service.js";
import TodoDto from "../../dtos/todoDto.js";
import todoDto from "../../dtos/todoDto.js";

class TodoService {
  constructor() {}
  async getTodos(userId) {
    const user = await User.findById(userId);
    const updatedUser = await user.populate("todos");
    return updatedUser.todos.map(e => {
      return new todoDto(e);
    });
  }

  async addTodo(userId, todo) {
    if (!todo) {
      throw ApiError.BadRequest("no todo");
    }

    const newTodo = await Todo.create({
      text: todo.text,
      user_id: userId,
      status: todo.status
    });
    await userTodoService.addTodoToUser(newTodo._id, userId);
    const todoDto = new TodoDto(newTodo);
    return { ...todoDto };
  }

  async updateTodo(todoData) {
    const statuses = ["active", "completed", "inprocess", "cancelled"];
    const { text, id, status } = todoData;
    const todo = await Todo.findById(id);
    if (!todo) {
      throw ApiError.BadRequest("such todo doesnt exist");
    }
    if (!statuses.includes(status)) {
      throw ApiError.BadRequest("wrong status");
    }
    const updated = await todo.updateOne({
      $set: {
        text,
        status
      }
    });
    const updatedTodo = await Todo.findById(id);
    const todoDto = new TodoDto(updatedTodo);
    return { ...todoDto };
  }

  async deleteTodo(userId, todoId) {
    if (!userId || !todoId) {
      throw ApiError.BadRequest("no params specified");
    }
    const deletedTodo = await Todo.findById(todoId);
    if (!deletedTodo) {
      throw ApiError.BadRequest("such todo doesnt exist");
    }
    await Todo.deleteOne({
      _id: todoId
    });
    await userTodoService.deleteUsersTodo(userId, todoId);
    return todoId;
  }
}

export default new TodoService();
