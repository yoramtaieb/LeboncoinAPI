const express = require('express');
require('express-async-errors');
const productRouter = express.Router();
const jwt = require('../utils/jwt')
const {BadRequestError, NotFoundError, ForbiddenError } = require('../src/helpers/errors');
const { CREATED, OK } = require('../src/helpers/status_code');
const { addProduct, getAllProduct, getProductByName, getProductByCategories, getProductByCities, updateProduct, deleteProduct } = require('../src/controllers/Product');
const { getCityById } = require('../src/controllers/Cities');
const { getCategorieById } = require('../src/controllers/Categories');
const NOSTRING_REGEX = /^\d+$/;

// Récupérer tous les produits
productRouter.get('/product', async (request, response) => {
  const product = await getAllProduct();
  if(product.length === 0) {
    throw new NotFoundError('Ressource introuvable',"Aucuns produits trouvés 😿");
  }
  response.status(OK).json(product);
});

// Récupérer un produit par le nom
productRouter.get('/product/:name', async (request, response) => {
  const product = await getProductByName(request.params.name);
  if(!product) {
    throw new NotFoundError('Ressource introuvable',"Ce produit n'existe pas 😿");
  }
  response.status(OK).json(product);
});

// Récupérer tous les produits d'une catégorie
productRouter.get('/product/categorie/:idCategory', async (request, response) => {
  const categorie = await getProductByCategories(request.params.idCategory);
  if(categorie.length === 0) {
    throw new NotFoundError('Ressource introuvable',"Aucuns produits trouvés 😿");
  }
  response.status(OK).json(categorie);
});

// Récupérer tous les produits d'une région
productRouter.get('/product/citie/:idCity', async (request, response) => {
  const cities = await getProductByCities(request.params.idCity);
  if(cities.length === 0) {
    throw new NotFoundError('Ressource introuvable',"Aucuns produits trouvés 😿");
  }
  response.status(OK).json(cities);
});

// Ajouter un produit
productRouter.post('/product', jwt.authenticateJWT, async (request, response) => {
    const { price, description } = request.body;
    const { userRole } = request.user
    if(userRole === 'Acheteur') {
      throw new ForbiddenError();
    }
    if(!NOSTRING_REGEX.test(price)) {
      throw new BadRequestError('Mauvaise requête', 'Le champ doit être un nombre entier');
    }
    if(description === null || description === undefined || description === '') {
      throw new BadRequestError('Mauvaise requête', "Le champ description n'est pas renseigné");
    }

    const newProduct = await addProduct(request.body);
    const cityFound = await getCityById(request.body.idCity)
    const categoryFound = await getCategorieById(request.body.idCategory)
    return response.status(CREATED).json({
      id: newProduct.id,
      city: cityFound.name,
      categorie: categoryFound.name,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    });
  })

// Modifier un produit
productRouter.patch('/product/edit/:id', jwt.authenticateJWT, updateProduct)

// Supprimer un produit
productRouter.delete('/product/delete/:id', jwt.authenticateJWT, deleteProduct)

module.exports = productRouter;
