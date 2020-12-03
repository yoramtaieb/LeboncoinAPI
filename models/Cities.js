"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: {
          name: "idCity",
        },
      });
    }
  }
  Cities.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cities",
    }
  );
  return Cities;
};
