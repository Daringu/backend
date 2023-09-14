import { Schema, model } from "mongoose";

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  activationLink: {
    type: String,
    required: true
  },
  roles: {
    type: [{ type: String }]
  },
  isActivated: {
    type: Boolean,
    default: false
  },
  todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }]
});

export default model("User", User);
