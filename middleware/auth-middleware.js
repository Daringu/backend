import ApiError from "../exeptions/api-errors.js";
import tokenService from "../userModule/service/token.service.js";

export default function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log("88888888888888888888888888888888880");
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    console.log("88888888888888888888888888888888881");
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    console.log("88888888888888888888888888888888882");
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    console.log("88888888888888888888888888888888883");
    req.user = { ...userData };
    console.log("user", req.user);
    next();
  } catch (error) {
    console.log(error);
    return next(ApiError.UnauthorizedError());
  }
}

export function isActivatedMiddleware(req, res, next) {
  console.log(req.user);
  if (!req.user.isActivated) {
    return next(ApiError.UnactivatedEmailError());
  }
  next();
}
