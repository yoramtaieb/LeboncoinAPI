const models = require('../../models');
const { Product } = models;

const productAttributes = [
  'idCity',
  'name',
  'description',
  'price',
];

module.exports = {
  addProduct: (data) => {
    const {
        idCity,
        name,
        description,
        price,
    } = data;

  return Product.create({
        idCity,
        name,
        description,
        price,
    });
  },
 
  getAllProduct: () => {
    return Product.findAll({
      attributes: productAttributes,
    });
  },

  getProduct: (name) => {
    return Product.findOne({
      where: { name: name },
      attributes: productAttributes,
    });
  },

  deleteProduct: (name) => {
    return Product.destroy({
      where: { name: name },
    });
  },

}
