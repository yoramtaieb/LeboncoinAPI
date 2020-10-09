const express = require("express");
const userRouter = express.Router();
require("express-async-errors");
const jwt = require("../utils/jwt");
const bodyParser = require("body-parser");
const { User } = require('../../models')
const {
  getUserById,
  updateUser,
  deleteUser,
} = require("../../src/controllers/User");
const { OK } = require("../helpers/status_code");
const { NotFoundError } = require("../../src/helpers/errors");

userRouter.get("/user/me", jwt.authenticateJWT, async (request, response) => {
  const user = await User.findByPk(request.user.userId);
  response.status(OK).json(user);
});

// Récupérer tous les utilisateurs
userRouter.get("/user", async (request, response) => {
  const users = await getUserById();
  if (users.length === 0) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Aucuns utilisateurs trouvés"
    );
  }
  response.status(OK).json(users);
});

// Récupérer tous les utilisateurs par l'id
userRouter.get("/users/:id", async (request, response) => {
  const userId = await getUserById(request.params.id);
  if (userId === null) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Aucuns utilisateurs trouvés"
    );
  }
  response.status(OK).json(userId);
});

// Modifier un utilisateur
userRouter.patch("/user/edit/:id", jwt.authenticateJWT, updateUser);

// Supprimer un utilisateur
userRouter.delete("/user/delete/:id", jwt.authenticateJWT, deleteUser);

module.exports = userRouter;
