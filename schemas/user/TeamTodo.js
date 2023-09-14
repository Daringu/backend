import { Schema, model } from "mongoose";

const teamTodo = new Schema(
  {
    createdBy: {
      type: String,
      required: true
    },
    takenBy: {
      type: String,
      default: "none"
    },
    text: {
      type: String,
      default: "blud forgor to add text"
    },
    status: {
      type: String,
      required: true,
      default: "active"
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team"
    }
  },
  { timestamps: true }
);

export default model("TeamTodo", teamTodo);
