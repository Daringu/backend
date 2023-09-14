import { MessageDto } from "../dtos/messageDto.js";
import { TeamTodoDto } from "../dtos/todoDto.js";
import Message from "../schemas/user/Message.js";
import Team from "../schemas/user/Team.js";
import TeamTodo from "../schemas/user/TeamTodo.js";
import User from "../schemas/user/User.js";

export function handleAddTodo(io, socket) {
  socket.on("add-todo", async ({ teamTodo, teamId, userId }) => {
    try {
      const team = await Team.findById(teamId);

      if (!team.users.includes(userId)) {
        throw new Error("You are not a member of this team");
      }

      const todo = await TeamTodo.create({ ...teamTodo, team: teamId });
      await team.updateOne({ $push: { teamTodos: todo._id } });
      io.to(teamId).emit("added-todo", { ...new TeamTodoDto(todo) });
    } catch (error) {
      console.log(error);
    }
  });
}

export function handleUpdateTodo(io, socket) {
  socket.on("update-todo", async ({ teamTodo, teamId, userId }) => {
    try {
      const team = await Team.findById(teamId);

      if (!team.users.includes(userId)) {
        throw new Error("You are not a member of this team");
      }
      const todo = await TeamTodo.findByIdAndUpdate(teamTodo.id, {
        ...teamTodo
      });

      const tosend = await TeamTodo.findById(teamTodo.id);

      io.to(teamId).emit("updated-todo", { ...new TeamTodoDto(tosend) });
    } catch (error) {
      console.log(error);
    }
  });
}

export function handleDeleteTodo(io, socket) {
  socket.on("delete-todo", async ({ teamTodoId, teamId, userId }) => {
    try {
      const team = await Team.findById(teamId);

      if (!team.users.includes(userId)) {
        throw new Error("You are not a member of this team");
      }

      const todo = await TeamTodo.findByIdAndDelete(teamTodoId);

      team.updateOne({ $pull: { teamTodos: teamTodoId } });

      io.to(teamId).emit("deleted-todo", teamTodoId);
    } catch (error) {
      console.log(error);
    }
  });
}

export function sendInvitation(io, socket) {
  socket.on("send-invitation", async ({ teamId, userId, target }) => {
    try {
      const team = await Team.findById(teamId);
      if (!team || team.createdBy.toHexString() !== userId) {
        socket.emit("error", {
          message: "You are not the creator of the team"
        });

        return;
      }

      const user = await User.findOne({ username: target });
      if (!user) {
        socket.emit("error", { message: "User not found" });
        return;
      }
      if (team.users.includes(user._id)) {
        socket.emit("error", { message: "User is already in the team" });
        return;
      }

      const alreadyHaveInvitation = await user.populate("messages");

      if (
        alreadyHaveInvitation.messages.some(
          message => message.messageAttachment === teamId
        )
      ) {
        socket.emit("error", {
          message: "User has already been invited to this team"
        });
        return;
      }

      const message = await Message.create({
        text: `You have been invited to join ${team.teamName}`,
        messageType: "invitation",
        messageAttachment: teamId,
        seen: false
      });

      const messageId = message._id;

      await team.updateOne({ $push: { invitations: messageId } });

      const toSend = await Message.findById(messageId);

      await user.updateOne({ $push: { messages: messageId } });
      console.log("emit", user._id.toHexString());
      socket.to(user._id.toHexString()).emit("message", new MessageDto(toSend));
    } catch (error) {
      console.log(error);
    }
  });
}
