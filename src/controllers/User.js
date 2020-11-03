const express = require("express");
require("express-async-errors");
const bcrypt = require("bcrypt");
const model = require("../../models");
const jwtUtils = require("../utils/jwt");
const User = model.User;
const Product = model.Product;
const {
  BadRequestError,
  ConflictError,
  UnAuthorizedError,
} = require("../helpers/errors");

const { OK } = require("../helpers/status_code");
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]{1,}$/;
const { checkPassword } = require("../utils/password");

const userAttributes = [
  "id",
  "firstName",
  "lastName",
  "email",
  "password",
  "birthday",
  "role",
  "createdAt",
  "updatedAt",
];

module.exports = {
  signUp: async (props) => {
    const { firstName, lastName, email, password, birthday, role } = props;
    if (firstName === null || firstName === undefined || firstName === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le prénom n'est pas renseigné."
      );
    }
    if (birthday === null || birthday === undefined || birthday === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "La date de naissance n'est pas renseignée."
      );
    }
    if (role === null || role === undefined || role === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le rôle n'est pas renseigné."
      );
    }
    if (!FIRSTNAME_REGEX.test(firstName)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le prénom doit être une chaîne de caractère."
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "L'email n'est pas valide."
      );
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Mot de passe invalide (doit avoir une longueur de 4 à 8 caractère et inclure au moins 1 chiffre)."
      );
    } else {
      const userFound = await User.findOne({
        attributes: ["email"],
        where: { email: email },
      });
      if (userFound === null) {
        const checkPassword = await bcrypt.hash(password, 10);
        return User.create({
          firstName,
          lastName,
          email,
          password: checkPassword,
          birthday,
          role,
        });
      } else {
        throw new ConflictError(
          "Erreur de conflit",
          "Un utilisateur utilisant cette adresse email est déjà enregistré."
        );
      }
    }
  },

  signIn: async (request, response) => {
    const { email, password } = request.body;
    if (email === "" || password === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Les champs ne sont pas renseignés."
      );
    } else {
      const userFound = await User.findOne({
        where: {
          email: email,
        },
      });
      if (userFound) {
        const isIdentified = await checkPassword(password, userFound.password);
        if (isIdentified) {
          response.status(OK).json({
            token: jwtUtils.genToken(userFound),
            user: {
              id: userFound.id,
              firstName: userFound.firstName,
              lastName: userFound.lastName,
              email: userFound.email,
              role: userFound.role,
              createdAt: userFound.createdAt,
              updatedAt: userFound.updatedAt,
            },
          });
        } else {
          throw new UnAuthorizedError(
            "Accès refusé",
            "Votre mot de passe n'est pas correct, veuillez recommencer."
          );
        }
      } else {
        throw new UnAuthorizedError(
          "Accès refusé",
          "L’e-mail entré ne correspond à aucun compte. Veuillez créer un compte."
        );
      }
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async (request, response) => {
    const { id } = request.body;
    return await User.findOne({
      order: [["createdAt", "updatedAt"]],
      where: { id },
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
    const { firstName, lastName, email, password } = request.body;
    const userId = request.params.id;
    if (firstName === null || firstName === undefined || firstName === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le prénom n'est pas renseigné."
      );
    }
    if (lastName === null || lastName === undefined || lastName === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le nom n'est pas renseigné."
      );
    }
    if (email === null || email === undefined || email === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "L'email n'est pas renseigné."
      );
    }
    if (password === null || password === undefined || password === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le mot de passe n'est pas renseigné."
      );
    }
    bcrypt.hash(request.body.password, 5, async (err, hash) => {
      request.body.password = hash;
      const newData = request.body;
      newData.id = userId;
      await User.update(newData, {
        where: {
          id: userId,
        },
        raw: true,
        attributes: ["firstName", "lastName", "email", "password"],
      });
      return response.status(OK).json(newData);
    });
  },

  // Supprimer un utilisateur
  deleteUser: (idUser, id) => {
    Product.destroy({
      where: { idUser },
    });
    User.destroy({
      where: { id },
    });
  },
};
