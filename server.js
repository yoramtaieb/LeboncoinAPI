require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./src/routes");
const cors = require("cors");

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.use("/uploads", express.static((__dirname, "uploads")));

// Ici on appelle les routes du dossier routes
server.use(morgan("dev"));
server.use("/leboncoin", routes);

// Gestion des erreurs
const {
  notFoundHandler,
  errorLogger,
  errorHandler,
} = require("./src/middlewares");
server.use("*", notFoundHandler);
server.use(errorLogger);
server.use(errorHandler);

module.exports = server;
