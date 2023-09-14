import { MessageDto } from "./messageDto.js";

class UserDto {
  email;
  id;
  isActivated;
  username;
  roles;
  constructor({
    roles,
    username,
    email,
    _id,
    isActivated,
    teams = [],
    messages = []
  }) {
    this.messages = messages.map(message => {
      return new MessageDto(message);
    });
    this.teams = teams.map(team => {
      return {
        teamName: team.teamName,
        teamId: team._id
      };
    });
    this.roles = roles;
    this.username = username;
    this.email = email;
    this.id = _id;
    this.isActivated = isActivated;
  }
}

export default UserDto;
