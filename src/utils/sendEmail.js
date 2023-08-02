import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    service: "gmail",
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"Ecommerce Test App" <${process.env.EMAIL}>`, // sender address
    to,
    subject,
    html,
  });

  return info.accepted.length < 1 ? false : true;
};
