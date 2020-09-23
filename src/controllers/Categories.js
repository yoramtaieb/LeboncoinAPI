const db = require('../../models');
const { Categorie } = db;

module.exports = {
  getCategorieById: (id) => {
    return Categorie.findByPk(id, {
      attributes: ['name'],
    });
  },
};