const express = require("express");
require("express-async-errors");
const { Product, User, Cities, Categories } = require("../../models");
const fs = require("fs");
const { NotFoundError } = require("../../src/helpers/errors");

const deleteImage = async (productFound) => {
  const [, filename] = productFound.uploadPicture.split("/uploads/");
  fs.unlink(`uploads/${filename}`, (error) => {
    if (error) throw new Error(error);
  });
};

const productAttributes = [
  "id",
  "name",
  "description",
  "price",
  "uploadPicture",
  "createdAt",
  "updatedAt",
];

module.exports = {
  // Ajouter un produit
  addProduct: async (data, userId) => {
    const { name, description, price, uploadPicture } = data;
    const newProduct = await Product.create({
      idUser: userId,
      idCity: data.idCity,
      idCategory: data.idCategory,
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
  getAllProduct: async () => {
    const findProduct = await Product.findAll({
      limit: 8,
      order: [["createdAt", "DESC"]],
      raw: true,
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
    if (findProduct.length === 0) {
      throw new NotFoundError(
        "Ressource introuvable",
        "Aucuns produits répertoriés"
      );
    }
    return findProduct;
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
          attributes: ["id", "name"],
          where: {
            name: name,
          },
        },
        {
          model: Cities,
          attributes: ["id", "name"],
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

  // Supprimer un produit
  deleteProduct: async (id) => {
    const productFound = await Product.findOne({
      where: { id: id },
    });
    if (!productFound) {
      throw new NotFoundError(
        "Ressource introuvable",
        "Ce produit n'existe pas"
      );
    }
    await deleteImage(productFound);
    await Product.destroy({
      where: { id: id },
    });
  },
};
