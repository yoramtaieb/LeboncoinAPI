const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const router = express.Router();
const signUpRouter = require("./signUpRouter");
const signInRouter = require("./signInRouter");
const productRouter = require("./productRouter");
const userRouter = require("./userRouter");
const categorieRouter = require("./categorieRouter");
const citieRouter = require("./citieRouter");
const { OK } = require("../../src/helpers/status_code");

router.get("/", (request, response) => {
  response.status(OK).json({ message: "je suis la page d'accueil" });
});

router.use(bodyParser.json());
router.use(signUpRouter);
router.use(signInRouter);
router.use(productRouter);
router.use(userRouter);
router.use(categorieRouter);
router.use(citieRouter);

module.exports = router;
