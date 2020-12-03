const nodemailer = require("nodemailer");
const password = process.env.PASSWORDMAIL;

module.exports = {
  transporter: nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "simplontest730@gmail.com",
      pass: password,
    },
  }),

  mailOptions: {
    from: "simplontest730@gmail.com",
    to: "taieb.yoram@gmail.com",
  },
};
