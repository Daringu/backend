import { Schema, model } from "mongoose";
("this is team which is simillar to user entety but also has users and so on");

export const Team = new Schema({
  teamName: {
    type: String,
    default: `New Team ${Date.now()}`
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  teamTodos: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamTodo"
    }
  ]
});

export default model("Team", Team);
