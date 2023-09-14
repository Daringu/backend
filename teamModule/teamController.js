import teamService from "./teamService.js";

class TeamController {
  constructor() {}

  async createNewTeam(req, res, next) {
    try {
      const { id } = req.user;
      const { teamName } = req.body;
      const teamId = await teamService.createNewTeam(id, teamName);
      return res.json({
        teamId,
        teamName
      });
    } catch (error) {
      next(error);
    }
  }
  async getTeam(req, res, next) {
    try {
      const { teamId } = req.params;
      const team = await teamService.getTeam(teamId);
      return res.json(team);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteTeam(req, res, next) {
    try {
      const { id } = req.user;
      const { teamId } = req.body;
      await teamService.deleteTeam(id, teamId);
      return res.json({ status: 200 });
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
