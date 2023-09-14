import { cookie } from "express-validator";
import ApiError from "../exeptions/api-errors.js";
import tokenService from "../userModule/service/token.service.js";
import cookieParser from "cookie-parser";

export default function(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = { ...userData };
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
