class TodoDto {
  status;
  text;
  id;
  userId;
  constructor({ _id, status, text, user_id }) {
    this.status = status;
    this.id = _id;
    this.text = text;
    this.userId = user_id;
  }
}
export class TeamTodoDto {
  createdBy;
  takenBy;
  text;
  status;
  team;
  id;
  constructor({
    _id,
    createdBy,
    takenBy,
    text,
    status,
    team,
    createdAt,
    updatedAt
  }) {
    this.id = _id;
    this.createdBy = createdBy;
    this.takenBy = takenBy;
    this.text = text;
    this.status = status;
    this.team = team;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
export default TodoDto;
