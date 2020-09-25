const db = require('../../models');
const { Categories } = db;

module.exports = {
  getCategorieById: (id) => {
    return Categories.findByPk(id, {
      attributes: ['name'],
    });
  }
};