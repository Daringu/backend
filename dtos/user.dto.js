class UserDto {
  email;
  id;
  isActivated;
  username;
  roles;
  constructor({ roles, username, email, _id, isActivated }) {
    console.log("roles", roles);
    this.roles = roles;
    this.username = username;
    this.email = email;
    this.id = _id;
    this.isActivated = isActivated;
  }
}

export default UserDto;
