import User from "../../schemas/user/User.js";
import bcrypt from "bcrypt";
import * as uuid from "uuid";
import mailService from "./mail.service.js";
import tokenService from "./token.service.js";
import UserDto from "../../dtos/user.dto.js";
import ApiError from "../../exeptions/api-errors.js";

class UserService {
  async createNewUser({ username, email, password }) {
    const check = await User.findOne({
      $or: [
        {
          username
        },
        {
          email: email
        }
      ]
    });

    if (check) {
      throw ApiError.BadRequest("such user already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const activationLink = uuid.v4();

    const newUser = await User.create({
      password: hashedPassword,
      username,
      email: email,
      roles: ["ADMIN", "USER"],
      activationLink
    });

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(newUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto }
    };
  }

  async loginUser({ username, password }) {
    const user = await User.findOne({
      username
    });

    if (!user) {
      throw ApiError.BadRequest("such user does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.BadRequest("Wrong password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto }
    };
  }

  async verifyEmail(link) {
    try {
      const user = await User.findOne({
        activationLink: link
      });
      if (!user) {
        throw ApiError.BadRequest("such user does not exist");
      }
      if (user.isActivated) {
        return Promise.resolve("Your account has already been activated!");
      }

      await user.updateOne({
        $set: {
          isActivated: true
        }
      });
      return Promise.resolve("successfuly activated!");
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logOut(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto }
    };
  }
}

export default new UserService();
