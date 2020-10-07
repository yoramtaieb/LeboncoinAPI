const db = require("../../models");
const { Cities } = db;

module.exports = {
  getCityById: (id) => {
    return Cities.findByPk(id, {
      attributes: ["id", "name"],
    });
  },

  getCityByName: (name) => {
    return Cities.findOne({
      where: { name: name },
    });
  },
};
