import ApiError from "../exeptions/api-errors.js";
import Message from "../schemas/user/Message.js";
import Team from "../schemas/user/Team.js";
import User from "../schemas/user/User.js";

class Messageservice {
  constructor() {}

  async accpetInvitation({ teamId, messageId, userId }) {
    const team = await Team.findById(teamId);
    const message = await Message.findById(messageId);
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("The user does not exist anymore");
    }
    if (!message) {
      return {
        messageId: messageId,
        responseMessage: "The team does not exist anymore",
        status: 404
      };
    }

    await team.updateOne({ $push: { users: userId } });
    await user.updateOne({ $push: { teams: teamId } });
    await this.deleteMessage({ messageId, userId });
    const teamtoRespond = await Team.findById(teamId);

    return {
      messageId: messageId,
      responseMessage: "You have joined the team",
      team: {
        teamId: teamId,
        teamName: teamtoRespond.teamName
      }
    };
  }

  async deleteMessageService({ messageId, userId }) {
    await this.deleteMessage({ messageId, userId });
    return {
      messageId: messageId,
      responseMessage: "You have deleted the message",
      status: 200
    };
  }

  async declineInvitation({ messageId, userId }) {
    const message = await Message.findById(messageId);
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.BadRequest("The user does not exist anymore");
    }
    if (!message) {
      return {
        messageId: messageId,
        responseMessage: "The team does not exist anymore",
        status: 404
      };
    }
    await this.deleteMessage({ messageId, userId });
    await user.updateOne({ $pull: { messages: messageId } });
    return {
      messageId: messageId,
      responseMessage: "You have declined the invitation",
      status: 200
    };
  }

  async deleteMessage({ messageId, userId }) {
    await Message.findByIdAndDelete(messageId);
    await User.findByIdAndUpdate(userId, { $pull: { messages: messageId } });
  }
}

export default new Messageservice();
