import jwt from "jsonwebtoken";
import Token from "../../schemas/user/Token.js";

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "30m"
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d"
    });
    return {
      accessToken,
      refreshToken
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({
      user: userId
    });
    if (tokenData) {
      return await tokenData.updateOne({ $set: { refreshToken } });
    }
    const token = await Token.create({
      user: userId,
      refreshToken
    });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({
      refreshToken
    });
    return tokenData;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  async findToken(refreshToken) {
    console.log("refreshtokeninrefresh", refreshToken);
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
