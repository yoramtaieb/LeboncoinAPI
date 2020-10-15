const express = require("express");
const citieRouter = express.Router();
require("express-async-errors");
const bodyParser = require("body-parser");
const { OK } = require("../helpers/status_code");
const { getAllCities } = require("../controllers/Cities");

citieRouter.get("/cities/all", async (request, response) => {
  const allCities = await getAllCities();

  response.status(OK).json(allCities);
});

module.exports = citieRouter;
