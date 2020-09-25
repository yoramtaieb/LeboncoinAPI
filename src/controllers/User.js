const express = require('express');
require('express-async-errors');
const bcrypt = require('bcrypt');
const model = require('../../models');
const jwtUtils = require('../../utils/jwt');
const User = model.User;
const { BadRequestError, ConflictError, UnAuthorizedError, ServerError, NotFoundError } = require('../helpers/errors');
const { OK, CREATED } = require('../helpers/status_code');
const { request } = require('express');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]{1,}$/;

const userAttributes = [
  'id',
  'firstName', 
  'lastName', 
  'email', 
  'password', 
  'city', 
  'description', 
  'birthday', 
  'role' 
];

module.exports = {
  signUp: async (request, response) => {
    const { firstName, lastName, email, password, city, description, birthday, role } = request.body;
    if(firstName === null || firstName === undefined || firstName === '') {
      throw new BadRequestError('Mauvaise requête', "Le champs firstName n'est pas renseigne 😿");
    }
    if(!FIRSTNAME_REGEX.test(firstName)) {
      throw new BadRequestError('Mauvaise requête', 'Le champs firstName doit être une chaîne de caractère 👆');
    }
    if(!EMAIL_REGEX.test(email)) {
      throw new BadRequestError('Mauvaise requête', "L'email n'est pas valide 😿");
    }
    if(!PASSWORD_REGEX.test(password)) {
      throw new BadRequestError('Mauvaise requête', 'Mot de passe invalide 😿 (doit avoir une longueur de 4 à 8 caractère et inclure au moins 1 chiffre)');
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
            role 
          });
          response.status(CREATED).json(newUser);
        });
      } else {
        throw new ConflictError('Erreur de conflit', 'Un utilisateur utilisant cette adresse email est déjà enregistré 🙆‍♂️');
      }
    }
  },

  signIn: async (request, response) => {
    const { email, password } = request.body;
    if(email === '' || password === '') {
      throw new BadRequestError('Mauvaise requête', 'Les champs ne sont pas renseignés 😿');
    } else {
      const userFound = await User.findOne({ 
        where: { 
          email: email 
        } 
      });
      if(userFound) {
        bcrypt.compare(password, userFound.password, (error, resByScript) => {
          if (resByScript) {
            response.status(OK).json({
              user: {
                email: userFound.email,
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                role: userFound.role,
              },
              token: jwtUtils.genToken(userFound),
            });
          } else {
            throw new UnAuthorizedError('Accès non autorisé', "Votre mot de passe n'est pas correct 👆");
          }
        });
      } else {
        throw new ServerError('Erreur serveur', 'Impossible de vérifier cet utilisateur 😿');
      }
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: (request, response) => {
    return User.findAll({
      attributes: userAttributes,
    });
  },

  // Récupérer tous les utilisateurs par l'id
  getUserById: (id) => {
    return User.findByPk(id, {
      attributes: [
        'firstName', 
        'lastName', 
        'email', 
        'password', 
        'city', 
        'description', 
        'birthday', 
        'role' 
      ],
    });
  },

  // Modifier un utilisateur
  updateUser: async (request, response) => {   
    const { id } = request.body
    const user = {
        id: request.params.id,
        email: request.body.email,
        password: request.body.password,              
        city: request.body.city
    }
   const isFounded = await model.User.findOne({
       where: {
           id: user.id
       }
   })
   if(isFounded) {
     bcrypt.hash(user.password, 5, async (err, hash)=>{
       user.password = hash;
       await model.User.update({
         email: user.email,
         password: user.password,
         city: user.city
       },
       {
         where: {
           id: user.id
         }
       })
       return response.status(OK).json({ 
          message: "Votre profil a été mis à jour", 
          emailUpdated: user.email,
          passwordUpdated: user.password,
          cityUpdated: user.city
        })
      })
    } 
    if(id === null || id === undefined || id === ''){
      throw new NotFoundError('Erreur de conflit', 'Cet utilisateur n\'existe pas 🙅‍♂️');
    }
  }
}
