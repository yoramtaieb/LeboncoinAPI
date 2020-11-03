const express = require("express");
const userRouter = express.Router();
require("express-async-errors");
const jwt = require("../utils/jwt");
const bodyParser = require("body-parser");
const { User } = require("../../models");
const {
  getUserById,
  updateUser,
  deleteUser,
  deleteSeller,
} = require("../../src/controllers/User");
const { OK } = require("../helpers/status_code");
const { NotFoundError } = require("../../src/helpers/errors");
const { response } = require("express");

userRouter.get("/user/me", jwt.authenticateJWT, async (request, response) => {
  const user = await User.findByPk(request.user.userId);
  response.status(OK).json(user);
});

// Récupérer tous les utilisateurs
userRouter.get("/user/:id", async (request, response) => {
  const users = await getUserById();
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
userRouter.put("/user/edit/:id", jwt.authenticateJWT, updateUser);

userRouter.delete("/user/delete/:id", jwt.authenticateJWT, async (request, response) => {
    const userDeleted = await deleteUser(request.params.id, request.params.id);
    response.status(OK).json(userDeleted);
  }
);

module.exports = userRouter;
