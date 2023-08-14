import { Schema, model } from "mongoose";

const Todo = new Schema({
  text: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

export default model("Todo", Todo);
