import messageService from "./messageService.js";

class MessageController {
  constructor() {}

  async accpetInvitation(req, res, next) {
    try {
      const { teamId, messageId } = req.body;
      const { id } = req.user;
      const resp = await messageService.accpetInvitation({
        teamId,
        messageId,
        userId: id
      });
      return res.json(resp);
    } catch (error) {
      next(error);
    }
  }
  async declineInvitation(req, res, next) {
    try {
      const { messageId } = req.body;
      const { id } = req.user;
      const resp = await messageService.declineInvitation({
        messageId,
        userId: id
      });

      return res.json(resp);
    } catch (error) {
      next(error);
    }
  }
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.body;
      const { id } = req.user;
      const resp = await messageService.deleteMessageService({
        messageId,
        userId: id
      });
      return res.json(resp);
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
