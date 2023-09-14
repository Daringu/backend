import Team from "../schemas/user/Team.js";
import ApiError from "../exeptions/api-errors.js";

export async function isInTeamMiddleware(req, res, next) {
  try {
    const { id } = req.user;
    const { teamId: teamIdReq } = req.body;
    const { teamId } = req.params;
    const team = await Team.findById(teamId || teamIdReq);

    if (!team) {
      next(ApiError.NotFound("Team not found"));
    }

    const isIncluded = team.users.includes(id);

    if (!isIncluded) {
      return next(ApiError.NotIncluded());
    }
    next();
  } catch (error) {
    next(error);
  }
}
