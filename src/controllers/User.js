const express = require('express');
require('express-async-errors');
const bcrypt = require('bcrypt');

const model = require('../../models');
// const jwtUtils = require('../../utils/jwt');
const User = model.User;

const {
  BadRequestError,
  ConflictError,
  UnAuthorizedError,
  ServerError,
} = require('../helpers/errors');
const { OK, CREATED } = require('../helpers/status_code');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]{1,}$/;

module.exports = {
  signUp: async (request, response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      city,
      description,
      birthday,
      role,
    } = request.body;

    if (firstName === null || firstName === undefined) {
      throw new BadRequestError('Mauvaise requête', "le champs firstName n'est pas renseigne");
    }
    if (!FIRSTNAME_REGEX.test(firstName)) {
      throw new BadRequestError(
        'Mauvaise requête',
        'le champs firstName doit être une chaîne de caractère'
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new BadRequestError('Mauvaise requête', "l'email n'est pas valide");
    }
    if (!PASSWORD_REGEX.test(password)) {
      throw new BadRequestError(
        'Mauvaise requête',
        'mot de pass invalide (doit avoir une longueur de 4 à 8 caractère et inclure au moins 1 chiffre)'
      );
    } else {
      const userFound = await User.findOne({ attributes: ['email'], where: { email: email } });
      if (userFound === null) {
        bcrypt.hash(password, 5, async (error, bcryptPassword) => {
          const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: bcryptPassword,
            city,
            description,
            birthday,
            role,
          });
          response.status(CREATED).json(newUser);
        });
      } else {
        throw new ConflictError(
          'Erreur de conflit',
          'Un utilisateur utilisant cette adresse email est déjà enregistré'
        );
      }
    }
  }
};