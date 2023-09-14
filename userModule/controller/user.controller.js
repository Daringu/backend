import { validationResult } from "express-validator";
import User from "../../schemas/user/User.js";
import userService from "../service/user.service.js";
import ApiError from "../../exeptions/api-errors.js";

class UserController {
  async getAllUsers(req, res, next) {
    const users = await User.find();
    return res.json({
      data: {
        users: users
      }
    });
  }

  async loginUser(req, res, next) {
    try {
      const user = await userService.loginUser(req.body);
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"
        // domain: env.COOKIE_DOMAIN
      });
      res.cookie("token", user.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"

        // domain: env.COOKIE_DOMAIN
      });
      return res.json({ ...user });
    } catch (error) {
      next(error);
    }
  }

  async createNewUser(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        console.log(errors);
        next(ApiError.BadRequest("error", errors.array()));
      }

      const user = await userService.createNewUser(req.body);
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"

        // domain: env.COOKIE_DOMAIN
      });
      res.cookie("token", user.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"

        // domain: env.COOKIE_DOMAIN
      });
      return res.json({ ...user });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const result = await userService.verifyEmail(req.params.link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async logOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logOut(refreshToken);
      res.clearCookie("token");
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const user = await userService.refresh(refreshToken);
      res.cookie("refreshToken", user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"
        // domain: env.COOKIE_DOMAIN
      });
      res.cookie("token", user.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        path: "/"
        // domain: env.COOKIE_DOMAIN
      });
      return res.json({ ...user });
    } catch (error) {
      next(error);
    }
  }

  async authorize(req, res, next) {
    try {
      return res.json({ status: 200 });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
