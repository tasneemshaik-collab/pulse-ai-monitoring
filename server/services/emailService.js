const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

const sendAlertEmail =
  async (
    email,
    subject,
    message
  ) => {
    try {
      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,
        to: email,
        subject,
        html: message,
      });

      console.log(
        "📧 Alert email sent"
      );
    } catch (error) {
      console.error(
        "Email Error:",
        error
      );
    }
  };

module.exports = {
  sendAlertEmail,
};