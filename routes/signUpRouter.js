const express = require('express');
//require("express-async-errors");
const signUpRouter = express.Router();
const bodyParser = require('body-parser');

// Route Login
signUpRouter.get('/signup', (req, res) => {
  res.json({ message: 'je suis la route signup' });
});

module.exports = signUpRouter;