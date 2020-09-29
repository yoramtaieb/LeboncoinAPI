const express = require('express');
const signUpRouter = express.Router();
require('express-async-errors');
const userController = require('../../src/controllers/User');

signUpRouter.get('/signup', (request, response) => {
  response.json({ message: 'je suis la route signup' });
});

signUpRouter.post('/signup', userController.signUp);

module.exports = signUpRouter;

