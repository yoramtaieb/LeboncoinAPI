require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// ici on appelle les routes du dossier routes
server.use(morgan('dev'));
server.use(routes);

module.exports = server;