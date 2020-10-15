const express = require("express");
const productRouter = express.Router();
require("express-async-errors");
const jwt = require("../utils/jwt");
const bodyParser = require("body-parser");
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
productRouter.get("/product", async (request, response) => {
  const product = await getAllProduct();
  console.log(product);
  response.status(OK).json(product);
});

// Récupérer un produit par le nom
productRouter.get("/product/:name", async (request, response) => {
  const products = await getProductByName(request.params.name);
  if (!products) {
    throw new NotFoundError(
      "Ressource introuvable",
      "Ce produit n'existe pas 😿"
    );
  }

  return response.status(OK).json(products);
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
    const { name, description, price, idCategory, idCity } = request.body;
    const { userRole } = request.user;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    if (name === null || name === undefined || name === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ nom n'est pas renseigné"
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
    if (!NOSTRING_REGEX.test(price)) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ prix n'est pas renseigné"
      );
    }
    const host = request.get("host");
    const { filename } = request.file;
    if (filename === null || filename === undefined || filename === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Merci de renseigner une image"
      );
    }
    const productAdd = {
      ...request.body,
      uploadPicture: `${request.protocol}://${host}/uploads/${filename}`,
    };
    const newProduct = await addProduct(productAdd, request.user.userId);
    return response.status(CREATED).json(newProduct);
  }
);

// Modifier un produit
// productRouter.patch("/product/edit/:id", jwt.authenticateJWT, updateProduct);

// Supprimer un produit
productRouter.delete(
  "/product/delete/:id",
  jwt.authenticateJWT,
  async (request, response) => {
    const { userRole } = request.user;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    await deleteProduct(request.params.id);
    response.status(OK).json({ message: "L'annonce de livre a été supprimé" });
  }
);

// productRouter.get("/categories/all", async (request, response) => {
//   const allCategories = await getAllCategories();
//   response.status(OK).json(allCategories);
// });

// productRouter.get("/cities/all", async (request, response) => {
//   const allCities = await getAllCities();

//   response.status(OK).json(allCities);
// });

module.exports = productRouter;
