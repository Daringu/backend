import TeamDto from "../dtos/teamDto.js";
import Team from "../schemas/user/Team.js";
import User from "../schemas/user/User.js";
import ApiError from "../exeptions/api-errors.js";
import TeamTodo from "../schemas/user/TeamTodo.js";
import Message from "../schemas/user/Message.js";
class TeamService {
  static async addTeamToUser(userId, teamId) {
    await User.findByIdAndUpdate(userId, {
      $push: {
        teams: teamId
      }
    });
  }

  async createNewTeam(userId, teamName) {
    const team = await Team.create({
      teamName:
        teamName.length >= 1 ? teamName : "blud forgor to give it a name",
      createdBy: userId,
      users: [userId]
    });

    await TeamService.addTeamToUser(userId, team._id);
    console.log("team", team);
    return team._id;
  }

  async getTeam(teamId) {
    const team = await Team.findById(teamId);
    if (!team) {
      return new ApiError.NotFound("Team not found");
    }
    const populatedTeam = await Team.findById(teamId)
      .populate("users")
      .populate("teamTodos");
    return new TeamDto(populatedTeam);
  }

  async deleteTeam(userId, teamId) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw ApiError.NotFound("Team not found");
    }
    if (team.createdBy.toHexString() !== userId) {
      console.log("not the creator of the team");
      const user = await User.findById(userId);
      if (!user) {
        throw ApiError.NotFound("User not found");
      }
      await user.updateOne({ $pull: { teams: team._id } });
      await team.updateOne({ $pull: { users: user._id } });
      // throw ApiError.BadRequest("You are not the creator of this team");
      return;
    }

    const users = team.users;
    const todos = team.teamTodos;

    // Remove the teamId from all users in a single update
    await User.updateMany(
      { _id: { $in: users } },
      { $pull: { teams: teamId } }
    );
    await Message.deleteMany({ messageAttachment: teamId });
    ("remove all messages with the teamId as messageAttachment");
    ("remove all messages with the teamId as messageAttachment from users in a single update");

    await User.updateMany(
      { messages: { $in: [teamId] } },
      { $pull: { messages: teamId } }
    );
    await User.updateMany({ $pull: { messages: teamId } });

    // Delete team todos
    await TeamTodo.deleteMany({ team: teamId });

    // Delete the team
    await Team.findByIdAndDelete(teamId);
  }
}

export default new TeamService();
