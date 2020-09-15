const express = require('express');
require('express-async-errors');
const router = express.Router();
const signUpRouter = require('./signUpRouter');
const signInRouter = require('./signInRouter');
const bodyParser = require('body-parser');

// Middleware
router.use(bodyParser.json());

//Page accueil
router.get('/', (request, response) => {
  response.json({ message: 'je suis la page d\'accueil' });
});

// Routes
router.use(signUpRouter);
router.use(signInRouter);

module.exports = router;
