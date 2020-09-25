'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    
    static associate(models) {
      
      this.hasMany(models.Product, {
        foreignKey: {
          name: 'idCategory',
        },
      });
      
    }
  };
  Categories.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};