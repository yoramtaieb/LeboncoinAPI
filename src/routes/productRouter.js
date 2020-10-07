const express = require("express");
require("express-async-errors");
const productRouter = express.Router();
const jwt = require("../utils/jwt");
const {
  addProduct,
  getAllProduct,
  getProductByName,
  getProductByCategorieName,
  getProductByCitieName,
  updateProduct,
  deleteProduct,
} = require("../../src/controllers/Product");
const { upload } = require("../middlewares");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../helpers/errors");
const { CREATED, OK } = require("../helpers/status_code");
const NOSTRING_REGEX = /^\d+$/;

// Récupérer tous les produits
productRouter.get("/product", getAllProduct);

// Récupérer un produit par le nom
productRouter.get("/product/:name", async (request, response) => {
  const product = await getProductByName(request.params.name);
  if (!product) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Ce produit n'existe pas 😿"
    );
  }
  response.status(OK).json(product);
});

// Récupérer tous les produits par le nom d'une catégorie
productRouter.get("/product/categorie/:name", async (request, response) => {
  const categorie = await getProductByCategorieName(request.params.name);
  if (categorie.length === 0) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Aucuns produits trouvés 😿"
    );
  }
  response.status(OK).json(categorie);
});

// Récupérer tous les produits par le nom d'une région
productRouter.get("/product/citie/:name", async (request, response) => {
  const citie = await getProductByCitieName(request.params.name);
  if (citie.length === 0) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Aucuns produits trouvés 😿"
    );
  }
  response.status(OK).json(citie);
});

// Ajouter un produit
productRouter.post(
  "/product",
  jwt.authenticateJWT,
  upload,
  async (request, response) => {
    console.log("body", request.body);
    console.log("name", request.body.name);
    const { name, description, price } = request.body;
    const { userRole } = request.user;
    // console.log(request.user);
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    if (!NOSTRING_REGEX.test(price)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ price doit être un nombre entier"
      );
    }
    if (name === null || name === undefined || name === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ name n'est pas renseigné"
      );
    }
    if (
      description === null ||
      description === undefined ||
      description === ""
    ) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ description n'est pas renseigné"
      );
    }
    const host = request.get("host");
    console.log("file", request.file);
    const { filename } = request.file;
    const productAdd = {
      ...request.body,
      uploadPicture: `${request.protocol}://${host}/uploads/${filename}`,
    };
    // console.log("je suis le console log: ", productAdd);
    console.log(request.user.userId);
    const newProduct = await addProduct(productAdd, request.user.userId);
    return response.status(CREATED).json(newProduct);
  }
);

// Modifier un produit
productRouter.patch("/product/edit/:id", jwt.authenticateJWT, updateProduct);

// Supprimer un produit
productRouter.delete("/product/delete/:id", jwt.authenticateJWT, deleteProduct);

module.exports = productRouter;
