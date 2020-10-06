const express = require("express");
require("express-async-errors");
const models = require("../../models");
const { Product, User, Cities, Categories } = require("../../models");
const { getCityByName } = require("../../src/controllers/Cities");
const { getCategorieByName } = require("../../src/controllers/Categories");
const { getUserByName } = require("../../src/controllers/User");
const jwt = require("../utils/jwt");
const { UNAUTHORIZED, OK } = require("../../src/helpers/status_code");
const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require("../../src/helpers/errors");

const productAttributes = ["name", "description", "price", "uploadPicture"];

module.exports = {
  // Ajouter un produit
  addProduct: async (data) => {
    const userFound = await getUserByName(data.user);
    const cityFound = await getCityByName(data.city);
    const categoryFound = await getCategorieByName(data.categorie);
    if (userFound === null || userFound === undefined || userFound === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ user n'est pas renseigné ❌"
      );
    }
    if (cityFound === null || cityFound === undefined || cityFound === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ city n'est pas renseigné ❌"
      );
    }
    if (
      categoryFound === null ||
      categoryFound === undefined ||
      categoryFound === ""
    ) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ categorie n'est pas renseigné ❌"
      );
    }
    const { name, description, price, uploadPicture } = data;
    const newProduct = await Product.create({
      idUser: userFound.id,
      idCity: cityFound.id,
      idCategory: categoryFound.id,
      name,
      description,
      price,
      uploadPicture,
    });

    const products = await Product.findByPk(newProduct.id, {
      attributes: productAttributes,
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Cities,
          attributes: ["name"],
        },
        {
          model: Categories,
          attributes: ["name"],
        },
      ],
    });
    return products;
  },

  // Récupérer tous les produits
  getAllProduct: async (request, response) => {
    return await Product.findAll({
      attributes: productAttributes,
      include: [
        {
          model: User,
          attributes: ["firstName"],
        },
        {
          model: Cities,
          attributes: ["name"],
        },
        {
          model: Categories,
          attributes: ["name"],
        },
      ],
    });
  },

  // Récupérer un produit par le nom
  getProductByName: async (name) => {
    return await Product.findOne({
      where: { name: name },
      attributes: productAttributes,
    });
  },

  // Récupérer tous les produits par le nom d'une catégorie
  getProductByCategorieName: (name) => {
    return Product.findAll({
      include: [
        {
          model: Categories,
          attributes: ["name"],
          where: {
            name: name,
          },
        },
      ],
    });
  },

  // Récupérer tous les produits par le nom d'une région
  getProductByCitieName: (name) => {
    return Product.findAll({
      include: [
        {
          model: Cities,
          attributes: ["name"],
          where: {
            name: name,
          },
        },
      ],
    });
  },

  // Modifier un produit
  updateProduct: async (request, response) => {
    const { id, name, description, price } = request.body;
    const { userRole } = request.user;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    if (name === null || name === undefined || name === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ name n'est pas renseigné ❌"
      );
    }
    if (
      description === null ||
      description === undefined ||
      description === ""
    ) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ description n'est pas renseigné ❌"
      );
    }
    if (price === null || price === undefined || price === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ price doit être un nombre entier ❌"
      );
    }
    const cityFound = await getCityByName(request.body.city);
    const categoryFound = await getCategorieByName(request.body.categorie);
    if (cityFound === null || cityFound === undefined || cityFound === "") {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ city n'est pas renseigné ❌"
      );
    }
    if (
      categoryFound === null ||
      categoryFound === undefined ||
      categoryFound === ""
    ) {
      throw new BadRequestError(
        "Mauvaise requête",
        "Le champ categorie n'est pas renseigné ❌"
      );
    }
    const product = {
      id: request.params.id,
      idCity: request.body.idCity,
      idCategory: request.body.idCategory,
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
    };
    const isFounded = await models.Product.findOne({
      where: {
        id: product.id,
      },
    });
    if (isFounded) {
      await models.Product.update(
        {
          idCity: cityFound.id,
          idCategory: categoryFound.id,
          name: product.name,
          description: product.description,
          price: product.price,
        },
        {
          where: { id: product.id },
        }
      );
      return response.status(OK).json({
        message: "Le produit a bien été modifié 👍",
        nameUpdated: product.name,
        descriptionUpdated: product.description,
        priceUpdated: product.price,
      });
    } else if (id === null || id === undefined || id === "") {
      throw new NotFoundError(
        "Erreur de conflit",
        "Ce produit n'existe pas 🙅‍♂️"
      );
    }
  },

  // Supprimer un produit
  deleteProduct: async (request, response) => {
    const { userRole } = request.user;
    const { id } = request.body;
    if (userRole === "Acheteur") {
      throw new ForbiddenError();
    }
    const product = {
      id: request.params.id,
    };
    if (!product.id) {
      response.status(UNAUTHORIZED).json({
        error: "Vous n'êtes pas autorisé à accéder à cette ressource",
      });
    }
    const isFounded = await models.Product.findOne({
      where: {
        id: product.id,
      },
    });
    if (isFounded) {
      await models.Product.destroy({
        where: {
          id: product.id,
        },
      });
      return response.status(OK).json({
        message: "Votre produit a bien été supprimé 👍",
        productDeleted: product.id,
      });
    } else if (id === null || id === undefined || id === "") {
      throw new NotFoundError(
        "Erreur de conflit",
        "Ce produit n'existe pas 🙅‍♂️"
      );
    }
  },
};
