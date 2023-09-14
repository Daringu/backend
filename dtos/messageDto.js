export class MessageDto {
  id;
  text;
  messageType;
  messageAttachment;
  seen;

  constructor({ _id, text, messageType, messageAttachment, seen }) {
    this.id = _id;
    this.text = text;
    this.messageType = messageType;
    this.messageAttachment = messageAttachment;
    this.seen = seen;
  }
}
