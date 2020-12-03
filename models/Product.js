"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "idUser",
        },
      });

      this.belongsTo(models.Cities, {
        foreignKey: {
          name: "idCity",
        },
      });

      this.belongsTo(models.Categories, {
        foreignKey: {
          name: "idCategory",
        },
      });
    }
  }
  Product.init(
    {
      idUser: DataTypes.INTEGER,
      idCategory: DataTypes.INTEGER,
      idCity: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      uploadPicture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
