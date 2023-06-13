import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  host: "smtp",
  service: "gmail",
  port: 25,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html: body,
  };

  await transporter.sendMail(mailOptions);
};
