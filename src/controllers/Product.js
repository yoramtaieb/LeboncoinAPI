const express = require('express');
require('express-async-errors');
const models = require('../../models');
const { Product, User, Cities, Categories } = require('../../models');
const { getCityByName } = require('../../src/controllers/Cities');
const { getCategorieByName } = require('../../src/controllers/Categories');
const { getUserByName } = require('../../src/controllers/User');
const jwt = require('../../utils/jwt')
const { UNAUTHORIZED, OK } = require('../../src/helpers/status_code');
const { ForbiddenError, NotFoundError, BadRequestError } = require('../../src/helpers/errors');

const productAttributes = [
  'name',
  'description',
  'price',
];

module.exports = {
  // Ajouter un produit
  addProduct: async (data) => {
    const userFound = await getUserByName(data.user)
    const cityFound = await getCityByName(data.city)
    const categoryFound = await getCategorieByName(data.categorie)
    if(userFound === null || userFound === undefined || userFound === '') {
      throw new BadRequestError('Mauvaise requête', "Le champ user n'est pas renseigné ❌");
    }
    if(cityFound === null || cityFound === undefined || cityFound === '') {
      throw new BadRequestError('Mauvaise requête', "Le champ city n'est pas renseigné ❌");
    }
    if(categoryFound === null || categoryFound === undefined || categoryFound === '') {
      throw new BadRequestError('Mauvaise requête', "Le champ categorie n'est pas renseigné ❌");
    }
    
    const newProduct = await Product.create({
      idUser: userFound.id,
      idCity: cityFound.id,
      idCategory: categoryFound.id,
      name: data.name,
      description: data.description,
      price: data.price,
    });
    return await Product.findByPk(newProduct.id, {
      attributes: productAttributes,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: Cities,
          attributes: ['name']
        },
        {
          model: Categories,
          attributes: ['name']
        }
      ]
    });
  },

  // Récupérer tous les produits
  getAllProduct: (request, response) => {
    return Product.findAll({
      attributes: productAttributes,
      include: [
        {
          model: User,
          attributes: ['firstName']
        },
        {
          model: Cities
        },
        {
          model: Categories
        }
      ]
    });
  },

  // Récupérer un produit par le nom
  getProductByName: (name) => {
    return Product.findOne({
      where: { name: name },
      attributes: productAttributes,
    });
  },

// Récupérer tous les produits d'une catégorie
  getProductByCategories: (idCategory) =>{
    return Product.findAll({
      where: { idCategory: idCategory },
      attributes: productAttributes
    })
  },

// Récupérer tous les produits d'une région
  getProductByCities: (idCity) =>{
    return Product.findAll({
      where: { idCity: idCity },
      attributes: productAttributes
    })
  },

  // Modifier un produit
  updateProduct: async (request, response) => {
    const { id } = request.body
    const { userRole } = request.user
    if(userRole === 'Acheteur') {
      throw new ForbiddenError();
    }
    const cityFound = await getCityByName(request.body.city)
    const categoryFound = await getCategorieByName(request.body.categorie)
    const product = {
      id: request.params.id,
      idCity: request.body.idCity,
      idCategory: request.body.idCategory,
      name: request.body.name,
      description: request.body.description,
      price: request.body.price
    }
    const isFounded = await models.Product.findOne({
      where:{
        id: product.id,
      }
    })
    if(isFounded){
      await models.Product.update({
        idCity: cityFound.id,
        idCategory: categoryFound.id,
        name: product.name,
        description: product.description,
        price: product.price
      },
      {
        where: { id: product.id}
      },
      )
        return response.status(OK).json({
        message: 'Le produit a bien été modifié 👍', 
        productUpdated: product.idCity, 
        productUpdated: product.idCategory, 
        productUpdated: product.name, 
        productUpdated: product.description, 
        productUpdated: product.price
      })
    } else if(id === null || id === undefined || id === ''){
      throw new NotFoundError('Erreur de conflit', 'Ce produit n\'existe pas 🙅‍♂️');
    }
    },

    // Supprimer un produit
    deleteProduct: async (request, response) =>{
      const { userRole } = request.user
      const { id } = request.body
      if(userRole === 'Acheteur') {
        throw new ForbiddenError();
      }
      const product = {
        id: request.params.id
      }
      if(!product.id){
        response.status(UNAUTHORIZED).json({
          error: 'Vous n\'êtes pas autorisé à accéder à cette ressource'
        })
      }
      const isFounded = await models.Product.findOne({
        where:{
          id: product.id,
        }
      })
      if(isFounded){
        await models.Product.destroy({
          where: {
            id: product.id
          }
        })
        return response.status(OK).json({ 
          message: 'Votre produit a bien été supprimé 👍', 
          productDeleted: product.id,
        })
      } else if(id === null || id === undefined || id === ''){
        throw new NotFoundError('Erreur de conflit', 'Ce produit n\'existe pas 🙅‍♂️');
      }
    }
  }
