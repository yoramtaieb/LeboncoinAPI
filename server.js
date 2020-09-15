require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes');

// Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// Ici on appelle les routes du dossier routes
server.use(morgan('dev'));
server.use('/leboncoin', routes);

// Gestion des erreurs
const { notFoundHandler, errorLogger, errorHandler } = require('./src/middlewares');
server.use('*', notFoundHandler);
server.use(errorLogger);
server.use(errorHandler);

module.exports = server;