'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: {
          name: 'idUser',
        },
      });
    }
  }
  
  User.init(
    {
      firstName: DataTypes.STRING(50),
      lastName: DataTypes.STRING(50),
      email: DataTypes.STRING(255),
      password: DataTypes.STRING(255),
      city: DataTypes.STRING(50),
      description: DataTypes.STRING(1000),
      birthday: DataTypes.DATE,
      role: DataTypes.STRING(30),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};