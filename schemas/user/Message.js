import { Schema, model } from "mongoose";

export const Message = new Schema({
  text: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    default: "text"
  },
  messageAttachment: {
    type: String
  },
  seen: {
    type: Boolean,
    default: false
  }
});

export default model("Message", Message);
