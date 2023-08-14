import nodemailer from "nodemailer";
import dotenb from "dotenv";
dotenb.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      logger: true,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      secure: true
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `ACCOUNT ACTIVATION FOR ${process.env.API_URL}`,
        text: "",
        html: `
        <div style="width: 500px; 
        height: 700px; 
        display: flex; 
        justify-content: space-around; 
        align-items: center; 
        flex-direction: column;
        background-image: url('https://images.saymedia-content.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cq_auto:eco%2Cw_1200/MTc2MjYxMDA5ODUyNjA1NjEz/ten-facts-about-zero-two.png');
         background-repeat: no-repeat; background-size: cover;">
            <h1>Follow the link to activate</h1>
            <a href="${link}">${link}</a>
        </div>
            `
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
}

export default new MailService();
