const models = require('../../models');
const { Product, Cities } = models;

const productAttributes = [
  'idCity',
  'name',
  'description',
  'price',
];

module.exports = {
  addProduct: (data) => {
    const { idCity, name, description, price } = data;

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

  updateProduct: async (request, response) => {
    const product = {
      id: request.params.id,
      name: request.body.name,
      description: request.body.description,
      price: request.body.price
    }
    const isFounded = await models.Product.findOne({
      where:{
        id: product.id,
      }
    })
    if(isFounded){
      await models.Product.update({
        name: product.name,
        description: product.description,
        price: product.price
      },
      {where: {id: product.id}}
      )
        return response.status(200).json({
        message: 'le produit a bien été modifié', 
        productUpdated: product.name, 
        productUpdated: product.description, 
        productUpdated: product.price
      })
    }}
  

  // deleteProduct: (name) => {
  //   return Product.destroy({
  //     where: { name: name },
  //   });
  // },

  }
