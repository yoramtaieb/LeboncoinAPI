const express = require("express");
const nodemailerRouter = express.Router();
const nodemailer = require("nodemailer");
const { CREATED, SERVER_ERROR } = require("../helpers/status_code");
const { BadRequestError } = require("../helpers/errors");
const password = process.env.PASSWORDMAIL;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "simplontest730@gmail.com",
    pass: password,
  },
});
const mailOptions = {
  from: "simplontest730@gmail.com",
  to: "taieb.yoram@gmail.com",
};

nodemailerRouter.post("/contact", async (request, response) => {
  const { email, messageSubject, message } = request.body;
  if (!EMAIL_REGEX.test(email)) {
    throw new BadRequestError("L'email n'est pas valide.");
  } else if (
    messageSubject === null ||
    messageSubject === undefined ||
    messageSubject === ""
  ) {
    throw new BadRequestError("Le champ sujet n'est pas renseigné.");
  } else if (message === null || message === undefined || message === "") {
    throw new BadRequestError("Le champ message n'est pas renseigné.");
  }
  const text = `
          Email : ${email} 
          Message : ${message}
    `;
  const subject = `Sujet : ${messageSubject}`;

  const sendMail = await transporter.sendMail({
    from: mailOptions.from,
    to: mailOptions.to,
    subject: subject,
    text: text,
  });
  if (!sendMail) {
    response.status(SERVER_ERROR).json({ error: "Problème" });
    console.log("Problème => ", error);
  }
  response.status(CREATED).json({ sendMail });
  console.log("Message envoyé ");
});

module.exports = nodemailerRouter;
