const express = require('express');
const signInRouter = express.Router();
require('express-async-errors');
const jwt = require('../utils/jwt')
const bodyParser = require('body-parser');
const userController = require('../src/controllers/User');

signInRouter.get('/signin', jwt.authenticateJWT, (request, response)=>{
    response.json({message: "je suis la route signin"})
})

signInRouter.post('/signin', userController.signIn);

module.exports = signInRouter;