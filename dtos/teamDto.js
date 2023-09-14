import UserDto from "./user.dto.js";
import { TeamTodoDto } from "./todoDto.js";
class TeamDto {
  teamTodos;
  createdBy;
  users;
  teamName;
  id;
  constructor({ _id, teamTodos, createdBy, users, teamName }) {
    this.id = _id;
    this.teamTodos = teamTodos.map(e => {
      return new TeamTodoDto(e);
    });
    this.createdBy = createdBy;
    this.users = users.map(e => {
      return new UserDto(e);
    });
    this.teamName = teamName;
  }
}

export default TeamDto;
