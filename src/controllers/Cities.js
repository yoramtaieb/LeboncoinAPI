const db = require('../../models');
const { Cities } = db;

module.exports = {
  getCityById: (id) => {
    return Cities.findByPk(id, {
      attributes: ['name'],
    });
  }
};