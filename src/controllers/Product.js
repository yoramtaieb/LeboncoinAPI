const express = require('express');
require('express-async-errors');
const models = require('../../models');
const { Product } = require('../../models');
const jwt = require('../../utils/jwt')
const { UNAUTHORIZED, OK } = require('../../src/helpers/status_code');
const { ForbiddenError, NotFoundError } = require('../../src/helpers/errors');
const Categories = require('./Categories');

const productAttributes = [
  'idCity',
  'idCategory',
  'name',
  'description',
  'price',
];

module.exports = {
  // Ajouter un produit
  addProduct: (data) => {
    const { idCity, idCategory, name, description, price } = data;
    return Product.create({
        idCity,
        idCategory,
        name,
        description,
        price,
    });
  },

  // Récupérer tous les produits
  getAllProduct: (request, response) => {
    return Product.findAll({
      attributes: productAttributes,
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
    const { userRole } = request.user
    const { id } = request.body
    if(userRole === 'Acheteur') {
      throw new ForbiddenError();
    }
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
        idCity: product.idCity,
        idCategory: product.idCategory,
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
