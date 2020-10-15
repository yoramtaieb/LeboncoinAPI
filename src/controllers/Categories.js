const db = require("../../models");
const { Categories } = db;

module.exports = {
  getCategorieById: (id) => {
    return Categories.findByPk(id, {
      attributes: ["name"],
    });
  },

  getCategorieByName: (name) => {
    return Categories.findOne({
      where: { name: name },
    });
  },

  getAllCategories: async () => {
    const allCategories = await Categories.findAll({
      attributes: ["id", "name"],
    });
    return allCategories;
  },
};
