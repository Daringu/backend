import User from "../../schemas/user/User.js";

class UserTodoService {
  constructor() {}

  async addTodoToUser(todoId, userId) {
    const user = await User.findById(userId);
    await user.updateOne({
      $set: {
        todos: [...user.todos, todoId]
      }
    });
  }

  async deleteUsersTodo(userId, todoId) {
    const user = await User.findById(userId);
    await user.todos.pull(todoId);
  }
}

export default new UserTodoService();
