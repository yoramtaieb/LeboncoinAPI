const express = require("express");
const categorieRouter = express.Router();
require("express-async-errors");
const bodyParser = require("body-parser");
const { getAllCategories } = require("../controllers/Categories");
const { OK } = require("../helpers/status_code");

categorieRouter.get("/categories/all", async (request, response) => {
  const allCategories = await getAllCategories();
  response.status(OK).json(allCategories);
});

module.exports = categorieRouter;
