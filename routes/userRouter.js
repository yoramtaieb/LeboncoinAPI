const express = require('express');
const userRouter = express.Router();
require('express-async-errors');
const jwt = require('../utils/jwt')
const bodyParser = require('body-parser');
const { getAllUsers, getUserById, updateUser } = require('../src/controllers/User');
const { OK } = require('../src/helpers/status_code');
const { NotFoundError } = require('../src/helpers/errors');

// Récupérer tous les utilisateurs
userRouter.get('/users', async (request, response)=>{
    const users = await getAllUsers();
  if(users.length === 0) {
    throw new NotFoundError('Ressource introuvable',"Aucuns utilisateurs trouvés 😿");
  }
  response.status(OK).json(users);
})

// Récupérer tous les utilisateurs par l'id
userRouter.get('/users/:id', async (request, response)=>{
  const userId = await getUserById(request.params.id);
  if(userId === null) {
    throw new NotFoundError('Ressource introuvable',"Aucuns utilisateurs trouvés 😿");
  }
  response.status(OK).json(userId);
})

// Modifier un utilisateur
userRouter.patch('/user/edit/:id', jwt.authenticateJWT, updateUser)

module.exports = userRouter;