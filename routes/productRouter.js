const express = require('express');
require('express-async-errors');
const productRouter = express.Router();
const jwt = require('../utils/jwt')

const {BadRequestError, NotFoundError, UnAuthorizedError } = require('../src/helpers/errors');
const { CREATED, OK } = require('../src/helpers/status_code');
const { addProduct, getAllProduct, getProduct, updateProduct } = require('../src/controllers/Product');
const { getCityById} = require('../src/controllers/Cities');
const { up } = require('../migrations/20200914095851-create-product-category');

const NOSTRING_REGEX = /^\d+$/;

productRouter.get('/product', async (request, response) => {
  const product = await getAllProduct();
  response.status(OK).json(product);
});

// Récupérer un produit par le nom
productRouter.get('/product/:name', async (request, response) => {
  const product = await getProduct(request.params.name);
  if (!product) {
    throw new NotFoundError('Ressource introuvable',"Ce produit n'existe pas");
  }
  response.status(OK).json(product);
});

// Poster un produit 
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
    const cityFound = await getCityById(request.body.idCity)

    return response.status(CREATED).json({
      id: newProduct.id,
      // idCity: newProduct.idCity,
      city: cityFound.name,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
    });
  })

  // Modifier un produit 
productRouter.patch('/product/edit/:id', updateProduct)




module.exports = productRouter;
