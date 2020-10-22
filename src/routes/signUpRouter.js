const { response } = require("express");
const express = require("express");
const User = require("../../src/controllers/User");
const signUpRouter = express.Router();
require("express-async-errors");
const { CREATED } = require("../helpers/status_code");
const userController = require("../../src/controllers/User");

signUpRouter.get("/signup", (request, response) => {
  response.json({ message: "je suis la route signup" });
});

signUpRouter.post("/signup", async (request, response) => {
  const newUser = await User.signUp(request.body);
  response.status(CREATED).json({ newUser });
});

module.exports = signUpRouter;
