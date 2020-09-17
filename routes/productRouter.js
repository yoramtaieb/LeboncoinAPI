const express = require('express');
require('express-async-errors');
const productRouter = express.Router();
const jwt = require('../utils/jwt')

const {BadRequestError, NotFoundError, UnAuthorizedError } = require('../src/helpers/errors');
const { CREATED, OK } = require('../src/helpers/status_code');
const { getAllProduct, getProduct, addProduct } = require('../src/controllers/Product');

const NOSTRING_REGEX = /^\d+$/;

productRouter.get('/product', async (request, response) => {
  const product = await getAllProduct();
  response.status(OK).json(books);
});

productRouter.get('/product/:name', async (request, response) => {
  const product = await getProduct(request.params.name);
  if (!product) {
    throw new NotFoundError('Ressource introuvable',"Ce produit n'existe pas");
  }
  response.status(OK).json(product);
});

productRouter.post('/product', jwt.authenticateJWT, async (request, response) => {
    const { price, description, role } = request.body;
    if (role === 'acheteur') {
      throw new ForbiddenError();
    }
    if (!NOSTRING_REGEX.test(price)) {
      throw new BadRequestError('Mauvaise requête', 'Le champ doit être un nombre entier');
    }
    if (description === null || description === undefined || description === '') {
      throw new BadRequestError('Mauvaise requête', "Le champ description n'est pas renseigné");
    }
    
    const newProduct = await addProduct(request.body);

    return response.status(CREATED).json({
      id: newProduct.id,
      idCity: newProduct.idCity,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    });
  },
);



module.exports = productRouter;
