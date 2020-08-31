const express = require('express');
// require('express-async-errors');
const router = express.Router();
const signUpRouter = require('./signUpRouter');
const bodyParser = require('body-parser');


// Middleware
router.use(bodyParser.json());

//Page accueil
router.get('/leboncoin', (request, response) => {
  response.json({ message: 'je suis la page d\'accueil' });
});

// Routes
router.use('/leboncoin', signUpRouter);

module.exports = router;