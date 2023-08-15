import ApiError from "../exeptions/api-errors.js";
import tokenService from "../userModule/service/token.service.js";

export default function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = {...userData};
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}

export function isActivatedMiddleware(req, res, next) {
  if (!req.user.isActivated) {
    return next(ApiError.UnactivatedEmailError());
  }
  next();
}
