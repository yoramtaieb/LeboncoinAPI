const express = require("express");
require("express-async-errors");
const bcrypt = require("bcrypt");
const model = require("../../models");
const jwtUtils = require("../utils/jwt");
const User = model.User;
const {
  BadRequestError,
  ConflictError,
  UnAuthorizedError,
  ServerError,
  NotFoundError,
} = require("../helpers/errors");

const { OK, CREATED } = require("../helpers/status_code");
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]{1,}$/;

const userAttributes = [
  "id",
  "firstName",
  "lastName",
  "email",
  "password",
  "birthday",
  "role",
];

module.exports = {
  signUp: async (request, response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      birthday,
      role,
    } = request.body;
    if (firstName === null || firstName === undefined || firstName === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champs firstName n'est pas renseigne 😿"
      );
    }
    if (!FIRSTNAME_REGEX.test(firstName)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champs firstName doit être une chaîne de caractère 👆"
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "L'email n'est pas valide 😿"
      );
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Mot de passe invalide 😿 (doit avoir une longueur de 4 à 8 caractère et inclure au moins 1 chiffre)"
      );
    } else {
      const userFound = await User.findOne({
        attributes: ["email"],
        where: { email: email },
      });
      if (userFound === null) {
        bcrypt.hash(password, 5, async (error, bcryptPassword) => {
          const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: bcryptPassword,
            birthday,
            role,
          });
          response.status(CREATED).json(newUser);
        });
      } else {
        throw new ConflictError(
          "Erreur de conflit",
          "Un utilisateur utilisant cette adresse email est déjà enregistré 🙆‍♂️"
        );
      }
    }
  },

  signIn: async (request, response) => {
    const { email, password } = request.body;
    if (email === "" || password === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Les champs ne sont pas renseignés 😿"
      );
    } else {
      const userFound = await User.findOne({
        where: {
          email: email,
        },
      });
      if (userFound) {
        bcrypt.compare(password, userFound.password, (error, resByScript) => {
          if (resByScript) {
            response.status(OK).json({
              token: jwtUtils.genToken(userFound),
              user: {
                email: userFound.email,
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                role: userFound.role,
              },
            });
          } else {
            throw new UnAuthorizedError(
              "Accès non autorisé",
              "Votre mot de passe n'est pas correct 👆"
            );
          }
        });
      } else {
        throw new ServerError(
          "Erreur serveur",
          "Impossible de vérifier cet utilisateur 😿"
        );
      }
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (request, response) => {
    return await User.findAll({
      attributes: userAttributes,
    });
  },

  // Récupérer tous les utilisateurs par le nom
  getUserByName: async (firstName) => {
    return await User.findOne({
      where: { firstName: firstName },
    });
  },

  // Récupérer tous les utilisateurs par l'id
  getUserById: async (id) => {
    return await User.findByPk(id, {
      attributes: ["firstName"],
    });
  },

  // Modifier un utilisateur
  updateUser: async (request, response) => {
    const { id, email, password } = request.body;
    // city
    const { userRole } = request.user;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    const user = {
      id: request.params.id,
      email: request.body.email,
      password: request.body.password,
    };
    if (email === null || email === undefined || email === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ email n'est pas renseigné ❌"
      );
    }
    if (password === null || password === undefined || password === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ password n'est pas renseigné ❌"
      );
    }
    const isFounded = await model.User.findOne({
      where: {
        id: user.id,
      },
    });
    if (isFounded) {
      bcrypt.hash(user.password, 5, async (err, hash) => {
        user.password = hash;
        await model.User.update(
          {
            email: user.email,
            password: user.password,
          },
          {
            where: {
              id: user.id,
            },
          }
        );
        return response.status(OK).json({
          message: `Votre profil a bien été mis à jour 👍`,
          emailUpdated: user.email,
          passwordUpdated: user.password,
        });
      });
    } else if (id === null || id === undefined || id === "") {
      throw new NotFoundError(
        "Erreur de conflit",
        "Cet utilisateur n'existe pas 🙅‍♂️"
      );
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (request, response) => {
    const { id } = request.body;
    const { userRole } = request.user;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    const user = {
      id: request.params.id,
    };
    if (!user.id) {
      response.status(UNAUTHORIZED).json({
        error: "Vous n'êtes pas autorisé à accéder à cette ressource",
      });
    }
    const isFounded = await model.User.findOne({
      where: {
        id: user.id,
      },
    });
    if (isFounded) {
      await model.User.destroy({
        where: {
          id: user.id,
        },
      });
      return response.status(OK).json({
        message: "Votre compte a bien été supprimé 👍",
        userDeleted: user.id,
      });
    } else if (id === null || id === undefined || id === "") {
      throw new NotFoundError(
        "Erreur de conflit",
        "Cet utilisateur n'existe pas 🙅‍♂️"
      );
    }
  },
};
